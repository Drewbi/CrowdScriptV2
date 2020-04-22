const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Episode = mongoose.model('Episode')
const Submission = mongoose.model('Submission')

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
  try {
    await segment.save()
  } catch (err) {
    return res.status(400).json({ message: 'Error adding Segment' })
  }
  try {
    const updateEpisode = await Episode.findById(episode)
    updateEpisode.segments.push(segment._id)
    await updateEpisode.save()
    return res.status(200).json({ segment })
  } catch (err) {
    await Segment.findByIdAndDelete(segment._id)
    res.status(400).json({ message: 'Error updating episode', error: err })
  }
}

const getNextSegment = async (req, res) => {
  const userSession = await findSessionByUser(res.locals.user)
  if (userSession) {
    const savedSegment = await Segment.findById(userSession.segment)
    return res.status(200).json({ savedSegment })
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
  const { id: segmentId } = req.body
  try {
    const { episode: episodeId } = await Segment.findById(segmentId)
    await Episode.updateOne({ _id: episodeId }, { $pull: { segments: segmentId } })
    await Submission.deleteMany({ segment: segmentId })
    const result = await Segment.deleteOne({ _id: segmentId })
    return result.ok === 1
      ? res.status(200).json({ message: 'Successfully deleted segment' })
      : res.status(400).json({ message: 'Failed to delete segment' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to delete segment' })
  }
}

module.exports = { getAllSegments, createSegment, getNextSegment, deleteSegment }
