const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

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
  segments: [
    {
      type: ObjectId,
      ref: 'Segment'
    }
  ],
  completed: {
    type: Boolean,
    required: true
  }
})

episodeSchema.pre('deleteOne', { document: true, query: false }, async function (query, next) {
  const Segment = mongoose.model('Segment')
  const segments = await Segment.find({ episode: this._id })
  await Promise.all(segments.map(segment => segment.deleteOne()))
})

module.exports = mongoose.model('Episode', episodeSchema)
