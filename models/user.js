const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = () => {
  const userSchema = mongoose.Schema({
    accessToken: String,
    name: {
      type: String,
      required: true
    },
    credit: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    },
    submission: [{
      type: ObjectId,
      ref: 'Submission'
    }]
  });
  return User;
};