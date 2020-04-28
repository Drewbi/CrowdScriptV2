const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const submissionSchema = mongoose.Schema({
  text: {
    type: String
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  segment: {
    type: ObjectId,
    ref: 'Segment'
  }
})

submissionSchema.post('save', async function () {
  const Segment = mongoose.model('Segment')
  await Segment.findByIdAndUpdate(this.segment, { $push: { submissions: this._id } }, { useFindAndModify: false })
})

submissionSchema.post('save', async function () {
  const User = mongoose.model('User')
  await User.findByIdAndUpdate(this.user, { $push: { submissions: this._id } }, { useFindAndModify: false })
})

submissionSchema.post('save', async function () {
  const Session = mongoose.model('Session')
  await Session.deleteOne({ user: this.user })
})

submissionSchema.post('save', async function () {
  const Segment = mongoose.model('Segment')
  const Episode = mongoose.model('Episode')
  const currentSegment = await Segment.findById(this.segment)
  const emptySegments = await Segment.find({ episode: currentSegment.episode, submissions: { $exists: true, $eq: [] } })
  if (emptySegments.length === 0) {
    await Episode.findByIdAndUpdate(currentSegment.episode, { completed: true }, { useFindAndModify: false })
  }
})

// Triggered from submission delete
submissionSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Segment = mongoose.model('Segment')
  await Segment.findByIdAndUpdate(this.segment, { $pull: { submissions: this._id } }, { useFindAndModify: false })
})

// Triggered from submission delete
submissionSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const User = mongoose.model('User')
  await User.findByIdAndUpdate(this.user, { $pull: { submissions: this._id } }, { useFindAndModify: false })
})

module.exports = mongoose.model('Submission', submissionSchema)
