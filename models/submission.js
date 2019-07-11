const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = () => {
  const submissionSchema = mongoose.Schema({
    text: {
      type: String
    },
    pass: {
      type: Number,
      required: true,
      min: 0
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    segment: {
      type: ObjectId,
      ref: 'Segment'
    }
  });
  return Submission;
};