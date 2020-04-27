const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Episode = mongoose.model('Episode')

const { nextSegment } = require('../_utils/segment')
const { findSessionByUser, createSession } = require('../_controllers/session')

const getAllSegments = async (req, res) => {
  const segments = await Segment.find()
  res.status(200).json({ segments })
}

const createSegment = async (req, res) => {
  const { number, text, episode, time } = req.body
  const segment = new Segment()
  segment.number = number
  segment.text = text
  segment.episode = episode
  segment.time = time
  await segment.save()
  return res.status(200).json({ segment })
}

const getNextSegment = async (req, res) => {
  const userSession = await findSessionByUser(res.locals.user)
  if (userSession) {
    const savedSegment = await Segment.findById(userSession.segment)
    return res.status(200).json({ segment: savedSegment })
  }
  const lowestEpisodes = await Episode.find({ completed: false }).sort({ number: -1 })
  if (lowestEpisodes.length === 0) return res.status(200).json({ message: 'All episodes complete' })
  const segment = await nextSegment(lowestEpisodes)
  try {
    await createSession(res.locals.user, segment._id)
    res.status(200).json({ segment })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Session could not be allocated' })
  }
}

const deleteSegment = async (req, res, next) => {
  const { id } = req.body
  const segment = await Segment.findById(id)
  if (!segment) return res.status(404).json({ message: 'Segment not found' })
  const result = await segment.deleteOne()
  return result
    ? res.status(200).json({ message: 'Successfully deleted segment' })
    : res.status(400).json({ message: 'Failed to delete segment' })
}

module.exports = { getAllSegments, createSegment, getNextSegment, deleteSegment }
