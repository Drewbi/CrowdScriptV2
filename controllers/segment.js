const mongoose = require("mongoose");
const ffmpeg = require('fluent-ffmpeg');

const Segment = mongoose.model("Segment");

module.exports.getSegment = (episodeID, segNum) => {
  return Segment.find({ episode: episodeID, number: segNum });
};

function addSegment(episode, number, text) {
  return new Promise((resolve, reject) => {
    const segment = new Segment();
    segment.episode = episode._id;
    segment.number = number;
    segment.text = text;
    segment.save(err => {
      if (err) reject(err);
      else resolve(segment);
    });
  });
};

module.exports.generateSegments = (srt, episode, file) => {
  return new Promise(async (resolve, reject) => {
    let segmentPromises = [];
    srt.forEach(srtSegment => {
      const promise = new Promise((resolve, reject) => {
        const {startTime, endTime} = srtSegment;
        ffmpeg(file).on('error', (err) => {
          reject(err.message);
        })
        .on('end', () => {
          console.log('Finished ' + srtSegment.id);
        })
        .setStartTime(startTime/1000).duration((endTime-startTime)/1000)
        .save(`public/exports/${episode.number}-${srtSegment.id}.mp3`);
        const segment = addSegment(episode, srtSegment.id, srtSegment.text);
        resolve(segment);
      });
      segmentPromises.push(promise);
    });
    const segmentList = await Promise.all(segmentPromises)
    resolve(segmentList);
  }); 
};