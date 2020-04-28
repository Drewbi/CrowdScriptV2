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
  const sessionPromises = segments.map(segment => {
    return Session.find({ segment: segment.id })
  })
  const sessions = await Promise.all(sessionPromises)
  const validSegments = segments.filter((segment, index) => {
    return sessions[index].length === 0
  })
  return validSegments.length !== 0 ? validSegments[0] : null
}
