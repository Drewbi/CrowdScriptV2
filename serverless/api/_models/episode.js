const mongoose = require('mongoose')

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
  src: {
    type: String,
    required: true
  },
  srt: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
})

episodeSchema.pre('deleteOne', { document: true, query: false }, async function (query, next) {
  const Segment = mongoose.model('Segment')
  const Submission = mongoose.model('Submission')
  const segments = await Segment.find({ episode: this._id })
  const segmentIds = segments.map(segment => segment._id)
  await Segment.deleteMany({ episode: this._id })
  await Submission.deleteMany({ segment: { $in: segmentIds } })
})

module.exports = mongoose.model('Episode', episodeSchema)
