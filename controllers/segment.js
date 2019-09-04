const mongoose = require("mongoose");

const Segment = mongoose.model("Segment");
const Episode = mongoose.model("Episode");

module.exports.getSegment = (epNum, segNum) => {
  return Segment.find({  });
};
