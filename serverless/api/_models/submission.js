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
  const segment = await Segment.findById(this.segment)
  await segment.updateOne({ $push: { submissions: this._id } })
})

submissionSchema.post('save', async function () {
  const User = mongoose.model('User')
  const user = await User.findById(this.user)
  await user.updateOne({ $push: { submissions: this._id } })
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
    const episode = await Episode.findById(this.episode)
    await episode.updateOne({ completed: true })
  }
})

submissionSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Segment = mongoose.model('Segment')
  const segment = await Segment.findById(this.segment)
  await segment.updateOne({ $pull: { submissions: this._id } })
})

submissionSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const User = mongoose.model('User')
  const user = await User.findById(this.user)
  await user.updateOne({ $pull: { submissions: this._id } })
})

module.exports = mongoose.model('Submission', submissionSchema)
