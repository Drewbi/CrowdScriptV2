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

submissionSchema.post('save', async function(query, next) {
  const Segment = mongoose.model('Segment')
  Segment.updateOne({ id: this.segment}, { $push: { submissions: this.id} })
})

submissionSchema.post('save', async function(query, next) {
  const User = mongoose.model('User')
  User.updateOne({ id: this.user}, { $push: { submissions: this.id} })
})

submissionSchema.post('save', async function(query, next) {
  const Session = mongoose.model('Session')
  Session.deleteOne({ user: this.user})
})

submissionSchema.post('save', async function(query, next) {
  const Segment = mongoose.model('Segment')
  const Episode = mongoose.model('Episode')
  const currentSegment = await Segment.findById(this.segment)
  const emptySegments = await Segment.find({ episode: currentSegment.episode, submissions: { $exists: true, $eq: [] } })
  if (emptySegments.length === 0) {
    Episode.updateOne({ id: this.user }, { completed: true })
  }
})

segmentSchema.pre('remove', async function(query, next) {
  const Segment = mongoose.model('Segment')
  Segment.updateOne({ id: this.segment}, { $pull: { submissions: this.id} })
})

segmentSchema.pre('remove', async function(query, next) {
  const User = mongoose.model('User')
  User.updateOne({ id: this.user}, { $pull: { submissions: this.id} })
})

module.exports = mongoose.model('Submission', submissionSchema)
