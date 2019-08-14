const mongoose = require('mongoose');

const Segment = mongoose.model('Segment');

module.exports.spliceSergments(episodeFile) = (req, res) => {
  return Segment.find({});
};

module.exports.getSegment(epNum, segNum) = (req, res) => {
  return Segment.find({});
};

module.exports.serveSegment = (req, res) => {

};