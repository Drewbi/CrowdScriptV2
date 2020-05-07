const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
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
  const segments = await Segment.find(
    { episode, submissions: { $exists: true, $eq: [] } }
  ).sort('number')
  const sessionPromises = segments.map(segment => {
    return Session.find({ segment: segment.id })
  })
  const sessions = await Promise.all(sessionPromises)
  const validSegments = segments.filter((segment, index) => {
    return sessions[index].length === 0
  })
  return validSegments.length !== 0 ? validSegments[0] : null
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
  const segmentPromises = segmentArray.map(segmentData => createSegment(segmentData))
  try {
    const segments = await Promise.all(segmentPromises)
    return segments
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = { nextSegment, checkEpisodeCompletion, createSegment, bulkCreate }
