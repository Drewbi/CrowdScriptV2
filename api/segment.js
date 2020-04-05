const express = require('express')
const app = express()
app.use(express.json())

require('./_utils/mongoose')
const Segment = require('./_models/segment')
const Episode = require('./_models/episode')
require('./_models/session')
const { validateSessions } = require('./_utils/session')
const { nextSegment } = require('./_utils/segment')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')

app.get('/', async (req, res, next) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const segments = await Segment.find()
  res.status(200).json({ segments })
})

app.get('/next', async (req, res, next) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  validateSessions()
  const lowestEpisodes = await Episode.find({ completed: false }).sort({ number: -1 })
  if (lowestEpisodes.length === 0) return res.status(200).json({ message: 'All episodes complete' })
  const segment = await nextSegment(lowestEpisodes)
  res.status(200).json({ segment })
})

module.exports = app
