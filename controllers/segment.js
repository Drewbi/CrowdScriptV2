const mongoose = require("mongoose");

const Segment = mongoose.model("Segment");

module.exports.getSegment = (episodeID, segNum) => {
  return Segment.find({ episode: episodeID, number: segNum });
};

module.exports.addSegment = (episode, text) => {
  const segment = new Segment();
  segment.episode = episode;
  segment.text = text;
  segment.save(err => {
    if (err) {
      console.error(`Error adding segment: ${err}`);
    }
  });
};
