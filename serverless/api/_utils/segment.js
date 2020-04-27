const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Session = mongoose.model('Session')

module.exports.nextSegment = async (episodes) => {
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
  const validSegmentPromises = segments.filter(async (segment) => {
    const existingSessions = await Session.find({ segment: segment.id })
    return existingSessions.length === 0
  })
  const validSegments = await Promise.all(validSegmentPromises)
  return validSegments.length !== 0 ? validSegments[0] : null
}
