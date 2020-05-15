const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Submission = mongoose.model('Submission')
const Session = mongoose.model('Session')
const Episode = mongoose.model('Episode')

const nextSegment = async (episodes) => {
  for (const episode of episodes) {
    const validSegment = await getSegmentFromEpisode(episode)
    if (validSegment) return validSegment
  }
  return null
}

const getSegmentFromEpisode = async (episode) => {
  const segments = await Segment.find({ episode: episode._id }).sort('number')
  const segmentIds = segments.map(segment => segment._id)
  const submissions = await Submission.find({ segment: { $in: segmentIds } })
  const filteredSegments = segments.filter(segment => {
    return !(submissions.some(submission => submission.segment.toString() === segment._id.toString()))
  })
  const sessions = await Session.find()
  const validSegments = filteredSegments.filter((segment, index) => {
    return !sessions.some(session => session.segment.toString() === segment._id.toString())
  })
  return validSegments[0]
}

const checkEpisodeCompletion = async (episode) => {
  const segments = await Segment.find({ episode, submissions: { $exists: true, $eq: [] } })
  let completed = false
  if (segments.length === 0) completed = true
  await Episode.updateOne({ _id: episode }, { completed })
}

const createSegment = async ({ number, text, episode, time }) => {
  const segment = new Segment({
    number, text, episode, time
  })
  return segment.save()
}

const bulkCreate = async (segmentArray) => {
  try {
    const segments = await Segment.insertMany(segmentArray)
    const segmentIds = segments.map(segment => segment.id)
    await Episode.update({ _id: segments[0].episode }, { segments: segmentIds })
    return segments
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = { nextSegment, checkEpisodeCompletion, createSegment, bulkCreate }
