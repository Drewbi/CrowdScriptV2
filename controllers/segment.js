const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { checkSegment } = require("../controllers/session");

const Segment = mongoose.model("Segment");

module.exports.getSegment = (episodeId, segNum) => {
  return Segment.find({ episode: episodeId, number: segNum });
};

module.exports.getSegmentById = (segmentId) => {
  return Segment.find({ _id: segmentId });
};

module.exports.getSegmentBySlug = segmentSlug => {
  return Segment.find({ slug: segmentSlug });
};

module.exports.getNextSegment = async (episode, pass) => {
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

module.exports.updateSegment = (segmentId, passes, submission) =>{
   return Segment.updateOne({_id: segmentId}, {$push: {submission: submission}, passes: passes});
}

function generateUID() {
  return new Promise(async (resolve, reject) => {
    let slug = Math.random()
      .toString(16)
      .substring(2, 12)
      .toUpperCase();
    const res = await exports.getSegmentBySlug(slug);
    if (res.length !== 0) {
      slug = generateUID();
    }
    resolve(slug);
  });
}

module.exports.generateSegments = (srt, episode, file) => {
  return new Promise(async (resolve, reject) => {
    const directory = `${process.env.PWD}/public/exports/${episode.number}`;
    fs.mkdirSync(directory);
    const segmentPromises = srt.map(srtSegment => {
      const promise = new Promise((resolve, reject) => {
        const { startTime, endTime } = srtSegment;
        ffmpeg(file)
          .on("error", err => {
            reject(err.message);
          })
          .on("end", async () => {
            console.log("Finished processing " + srtSegment.id);
            const slug = await generateUID();
            const segment = await addSegment(
              slug,
              episode,
              srtSegment.id,
              srtSegment.text
            );
            console.log("Generated segment " + slug);
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
