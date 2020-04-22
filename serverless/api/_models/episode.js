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

episodeSchema.pre('remove', async (next) => {
  this.model('Segment').deleteMany({ episode: this._id }, next)
})

module.exports = mongoose.model('Episode', episodeSchema)
