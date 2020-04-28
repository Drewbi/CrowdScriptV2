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
  await Episode.findByIdAndUpdate(this.episode, { $push: { segments: this._id }, completed: false }, { useFindAndModify: false })
})

segmentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Submission = mongoose.model('Submission')
  const submissions = await Submission.find({ segment: this._id })
  await Promise.all(submissions.map(submission => submission.deleteOne()))
})

segmentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Episode = mongoose.model('Episode')
  await Episode.findByIdAndUpdate(this.episode, { $pull: { segments: this._id } }, { useFindAndModify: false })
})

module.exports = mongoose.model('Segment', segmentSchema)
