const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { checkSegment } = require("../controllers/session");
const { getSubmissionById } = require("../controllers/submission");

const Segment = mongoose.model("Segment");

const getSegment = (episodeId, segNum) => {
  return Segment.find({ episode: episodeId, number: segNum }).sort('number');
};

const getSegmentById = (segmentId) => {
  return Segment.find({ _id: segmentId }).sort('number');
};

const getSegmentsByEpisode = (episodeId) => {
  return Segment.find({ episode: episodeId }).sort('number');
};

const getSegmentBySlug = segmentSlug => {
  return Segment.find({ slug: segmentSlug }).sort('number');
};

const getNextSegment = async (episode, pass) => {
  const segments = await Segment.find({ episode: episode, passes: { $lt: pass } }).sort("number");
  const filteredSegments = segments.filter(async (segment) => {
    return await checkSegment(segment);
  })
  return filteredSegments[0];
};

function addSegment(slug, episode, number, text) {
  return new Promise((resolve, reject) => {
    const segment = new Segment();
    segment.slug = slug;
    segment.episode = episode._id;
    segment.number = number;
    segment.text = text;
    segment.save(err => {
      if (err) reject(err);
      else resolve(segment);
    });
  });
}

const updateSegment = (segmentId, passes, submission) =>{
   return Segment.updateOne({_id: segmentId}, {$push: {submission: submission}, passes: passes});
}

function generateUID() {
  return new Promise(async (resolve, reject) => {
    let slug = Math.random()
      .toString(16)
      .substring(2, 12)
      .toUpperCase();
    const res = await getSegmentBySlug(slug);
    if (res.length !== 0) {
      slug = generateUID();
    }
    resolve(slug);
  });
}

const generateSegments = (srt, episode, file) => {
  return new Promise(async (resolve, reject) => {
    const directory = `${process.env.PWD}/public/exports/${episode.number}`;
    if(fs.existsSync(directory)) fs.rmdirSync(directory, { recursive: true })
    fs.mkdirSync(directory);
    const segmentPromises = srt.map(srtSegment => {
      const promise = new Promise(async (resolve, reject) => {
        const { startTime, endTime } = srtSegment;
        const slug = await generateUID();
        const segment = await addSegment(
          slug,
          episode,
          srtSegment.id,
          srtSegment.text
        );
        console.log("Generated segment " + slug);
        ffmpeg(file)
          .on("error", err => {
            reject(err.message);
          })
          .on("end", () => {
            console.log("Finished processing " + srtSegment.id);
            resolve(segment);
          })
          .setStartTime(startTime / 1000)
          .duration((endTime - startTime) / 1000)
          .save(
            `public/exports/${episode.number}/${episode.number}-${srtSegment.id}.mp3`
          );
      });
      return promise;
    });
    const segmentList = await Promise.all(segmentPromises);
    resolve(segmentList);
  });
};

const getSubmissionsFromEpisode = async (episodeId) => {
  const segments = await getSegmentsByEpisode(episodeId);
  if (!segments) return []
  const submissionIds = segments.filter(({ submission }) => {
    return submission.length > 0
  })
  .map(({ submission }) => {
    return submission[submission.length - 1]
  })
  if(!submissionIds) return []
  const submissionPromises = submissionIds.map((submissionId) => {
    return new Promise((resolve) => {
      getSubmissionById(submissionId).then((res) => {
        resolve(res)
      })
    })
  })
  return await Promise.all(submissionPromises)
}

module.exports = {
  getSegment,
  getSegmentById,
  getSegmentBySlug,
  getNextSegment,
  updateSegment,
  generateSegments,
  getSubmissionsFromEpisode
}