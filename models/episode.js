const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = () => {
  const episodeSchema = mongoose.Schema({
    number: {
      type: Number,
      required: true,
      index: true,
      unique: true,
      min: 1
    },
    name: {
      type: String,
      required: true
    },
    segment: [{
      type: ObjectId,
      ref: 'Segment'
    }]
  });
  return mongoose.model('Episode', episodeSchema);
};