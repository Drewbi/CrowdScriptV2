const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const sessionSchema = mongoose.Schema({
  segment: {
    type: ObjectId,
    required: true,
    ref: 'Segment'
  },
  user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
})

mongoose.model('Session', sessionSchema)
