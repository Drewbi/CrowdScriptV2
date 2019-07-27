const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const sessionSchema = mongoose.Schema ({
  sessionKey: {
    type: String,
    required: true,
    unique: true
  },
  currentSegment: {
    type: ObjectId,
    ref: 'Segment'
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

mongoose.model('Session', sessionSchema);