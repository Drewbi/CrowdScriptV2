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
  console.log('Episode deleteOne triggered')
  const Segment = mongoose.model('Segment')
  await Segment.deleteMany({ episode: this._id })
})

module.exports = mongoose.model('Episode', episodeSchema)
