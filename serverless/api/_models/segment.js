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
  },
  submissions: [
    {
      type: ObjectId,
      ref: 'Submission'
    }
  ]
})

segmentSchema.post('save', async function () {
  const Episode = mongoose.model('Episode')
  const episode = await Episode.findById(this.episode)
  await episode.updateOne({ $push: { segments: this._id } })
})

segmentSchema.post('updateOne', { document: true, query: false }, async function () {
  const { checkEpisodeCompletion } = require('../_utils/segment')
  await checkEpisodeCompletion(this.episode)
})

segmentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Submission = mongoose.model('Submission')
  const submissions = await Submission.find({ segment: this._id })
  await Promise.all(submissions.map(submission => submission.deleteOne()))
})

segmentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Episode = mongoose.model('Episode')
  const episode = await Episode.findById(this.episode)
  await episode.updateOne({ $pull: { segments: this._id } })
})

module.exports = mongoose.model('Segment', segmentSchema)
