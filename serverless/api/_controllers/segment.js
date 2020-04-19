const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Episode = mongoose.model('Episode')

const { nextSegment } = require('../_utils/segment')

const getAllSegments = async (req, res) => {
  const segments = await Segment.find()
  res.status(200).json({ segments })
}

const createSegment = (req, res) => {
  const { number, text, episode, time } = req.body
  const segment = new Segment()
  segment.number = number
  segment.text = text
  segment.episode = episode
  segment.time = time

  return segment.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding Segment', error: err })
    })
}

const getNextSegment = async (req, res) => {
  const lowestEpisodes = await Episode.find({ completed: false }).sort({ number: -1 })
  if (lowestEpisodes.length === 0) return res.status(200).json({ message: 'All episodes complete' })
  const segment = await nextSegment(lowestEpisodes)
  res.status(200).json({ segment })
}

module.exports = { getAllSegments, createSegment, getNextSegment }