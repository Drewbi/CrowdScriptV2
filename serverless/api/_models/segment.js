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


segmentSchema.pre('remove', async function(query, next) {
  const Submission = mongoose.model('Submission')
  Submission.deleteMany({ segment: this.id })
})

segmentSchema.post('save', async function() {
  const Episode = mongoose.model('Episode')
  Episode.updateOne({ id: this.episode}, { $push: { segments: this.id} })
})

segmentSchema.pre('remove', async function(query, next) {
  const Episode = mongoose.model('Episode')
  Episode.updateOne({ id: this.episode}, { $pull: { segments: this.id} })
})


module.exports = mongoose.model('Segment', segmentSchema)
