const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Episode = mongoose.model('Episode')

const { nextSegment, createSegment, bulkCreate } = require('../_utils/segment')
const { getSegmentsFromSRT } = require('../_utils/srt')
const { getDownloadLink } = require('../_utils/file')
const { findSessionByUser, createSession } = require('../_controllers/session')

const getAllSegments = async (req, res) => {
  const segments = await Segment.find()
  res.status(200).json({ segments })
}

const getEpisodeSegments = async (req, res) => {
  const { id } = req.params
  try {
    const segments = await Segment.find({ episode: id })
    res.status(200).json({ segments })
  } catch (err) {
    if (err.name === 'CastError') res.status(401).json({ message: 'Invalid Id' })
    else res.status(400).json({ message: 'Error occured finding segment' })
  }
}

const postSegment = async (req, res) => {
  const { number, text, episode, time } = req.body
  const segment = await createSegment({ number, text, episode, time })
  return res.status(200).json({ segment })
}

const generateSegments = async (req, res) => {
  const { number, srt } = req.body
  const episode = await Episode.findOne({ number })
  if (!episode._id) return res.status(500).json({ error: 'Segment generation could not locate episode' })
  try {
    const url = await getDownloadLink(srt)
    const segmentArray = await getSegmentsFromSRT(url, episode._id)
    const segments = await bulkCreate(segmentArray)
    res.status(200).json({ message: `Generated episode and created ${segments.length} segments` })
  } catch (err) {
    await episode.deleteOne()
    if (err.response && err.response.status === 403) return res.status(403).json({ error: 'Requested resource is restricted' })
    if (err.response && err.response.status === 404) return res.status(404).json({ error: 'Requested resource was not found' })
    console.log(err)
    return res.status(500).json({ error: 'Segment generation failed' })
  }
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
  if (!segment) return res.status(200).json({ message: 'All segments are allocated' })
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

module.exports = { getAllSegments, getEpisodeSegments, postSegment, getNextSegment, deleteSegment, generateSegments }
