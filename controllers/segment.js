const mongoose = require("mongoose");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const Segment = mongoose.model("Segment");

module.exports.getSegment = (episodeID, segNum) => {
  return Segment.find({ episode: episodeID, number: 1});
};

module.exports.getSegmentBySlug = (segmentSlug) => {
  return Segment.find({ slug: segmentSlug });
};

function addSegment(slug, episode, number, text) {
  return new Promise((resolve, reject) => {
    const segment = new Segment();
    segment.slug = slug
    segment.episode = episode._id;
    segment.number = number;
    segment.text = text;
    segment.save(err => {
      if (err) reject(err);
      else resolve(segment);
    });
  });
};

function generateUID() {
  return new Promise(async (resolve, reject) => {
    let id = Math.random().toString(16).substring(2, 12).toUpperCase();
    const res = await exports.getSegmentByID(id);
    if(res.length !== 0) {
      id = generateUID();
    }
    resolve(id);
  })
}

module.exports.generateSegments = (srt, episode, file) => {
  return new Promise(async (resolve, reject) => {
    const directory = `${process.env.PWD}/public/exports/${episode.number}`;
    fs.mkdirSync(directory);
    const segmentPromises = srt.map(srtSegment => {
      const promise = new Promise((resolve, reject) => {
        const {startTime, endTime} = srtSegment;
        ffmpeg(file).on('error', (err) => {
          reject(err.message);
        })
        .on('end', async () => {
          console.log('Finished processing ' + srtSegment.id);
          const slug = await generateUID();
          const segment = await addSegment(slug, episode, srtSegment.id, srtSegment.text);
          console.log('Generated segment ' + slug);
          resolve(segment);
        })
        .setStartTime(startTime/1000).duration((endTime-startTime)/1000)
        .save(`public/exports/${episode.number}/${episode.number}-${srtSegment.id}.mp3`);
      });
      return promise;
    });
    const segmentList = await Promise.all(segmentPromises)
    resolve(segmentList);
  }); 
};