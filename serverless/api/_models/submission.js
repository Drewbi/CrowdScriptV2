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

submissionSchema.post('save', function () {
  const Segment = mongoose.model('Segment')
  const Episode = mongoose.model('Episode')
  const Submission = mongoose.model('Submission')
  Segment.findById(this.segment).then(async currentSegment => {
    const episodeSegments = await Segment.find({ episode: currentSegment.episode })
    const submissions = await Submission.find()
    const filteredSegments = episodeSegments.filter(segment => {
      return !submissions.some(submission => submission.segment.toString() === segment._id.toString())
    })
    if (filteredSegments.length === 0) {
      const episode = await Episode.findById(this.episode)
      await episode.updateOne({ completed: true })
    }
  })
})

module.exports = mongoose.model('Submission', submissionSchema)
