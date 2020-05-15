const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const segmentSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  episode: {
    type: ObjectId,
    ref: 'Episode'
  },
  time: {
    in: {
      type: Number,
      require: true
    },
    out: {
      type: Number,
      require: true
    }
  }
})

segmentSchema.post('updateOne', { document: true, query: false }, async function () {
  const { checkEpisodeCompletion } = require('../_utils/segment')
  await checkEpisodeCompletion(this.episode)
})

segmentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Submission = mongoose.model('Submission')
  await Submission.deleteMany({ segment: this._id })
})

module.exports = mongoose.model('Segment', segmentSchema)
