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

segmentSchema.pre('remove', async (next) => {
  this.model('Submission').deleteMany({ segment: this.id }, next)
})

module.exports = mongoose.model('Segment', segmentSchema)
