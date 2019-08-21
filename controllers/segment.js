const mongoose = require("mongoose");

const Segment = mongoose.model("Segment");

module.exports.spliceSergments = episodeFile => {
  return Segment.find({});
};

module.exports.getSegment = (epNum, segNum) => {
  return Segment.find({});
};

module.exports.serveSegment = () => {};
