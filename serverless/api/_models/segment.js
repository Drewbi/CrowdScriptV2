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
  console.log('setting episode completion false')
  const Episode = mongoose.model('Episode')
  await Episode.findByIdAndUpdate(this.episode, { $push: { segments: this._id }, completed: false }, { useFindAndModify: false })
})

// Called when deleting episode
// TODO fix as this._id will be undefined until episode hook uses document deletion
segmentSchema.pre('deleteMany', async function (query, next) {
  console.log('Segment deleteMany triggered')
  const Submission = mongoose.model('Submission')
  await Submission.deleteMany({ segment: this._id })
})

// Called when deleting segment
segmentSchema.pre('deleteOne', { document: true, query: false }, async function (query, next) {
  console.log('Segment deleteOne triggered')
  const Submission = mongoose.model('Submission')
  await Submission.deleteMany({ segment: this._id })
})

// Called when deleting segment
segmentSchema.pre('deleteOne', { document: true, query: false }, async function (query, next) {
  const Episode = mongoose.model('Episode')
  await Episode.findByIdAndUpdate(this.episode, { $pull: { segments: this._id } }, { useFindAndModify: false })
})

module.exports = mongoose.model('Segment', segmentSchema)
