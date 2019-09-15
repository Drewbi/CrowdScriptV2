const mongoose = require("mongoose");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

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
    const directory = `${process.env.PWD}/public/exports/${episode.number}`;
    fs.mkdirSync(directory);
    let segmentPromises = [];
    srt.forEach(srtSegment => {
      const promise = new Promise((resolve, reject) => {
        const {startTime, endTime} = srtSegment;
        ffmpeg(file).on('error', (err) => {
          reject(err.message);
        })
        .on('end', () => {
          console.log('Finished ' + srtSegment.id);
          const segment = addSegment(episode, srtSegment.id, srtSegment.text);
          resolve(segment);
        })
        .setStartTime(startTime/1000).duration((endTime-startTime)/1000)
        .save(`public/exports/${episode.number}/${episode.number}-${srtSegment.id}.mp3`);
      });
      segmentPromises.push(promise);
    });
    const segmentList = await Promise.all(segmentPromises)
    resolve(segmentList);
  }); 
};