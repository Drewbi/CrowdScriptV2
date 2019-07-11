const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = () => {
  const segmentSchema = mongoose.Schema ({
    number: {
      type: Number,
      required: true,
      index: true,
      unique: true,
      min: 0
    },
    passes: {
      type: Number,
      default: 0
    },
    episode: {
      type: ObjectId,
      ref: 'Episode'
    },
    submission: [{
      type: ObjectId,
      ref: 'Submission'
    }]
  });
  return mongoose.model('Segment', segmentSchema);
};