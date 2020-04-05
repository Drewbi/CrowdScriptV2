const { Router, json } = require('express')
const router = Router()
router.use(json())

const mongoose = require('mongoose')
const Segment = mongoose.model('Segment')
const Episode = mongoose.model('Episode')

const { validateSessions } = require('../_utils/session')
const { nextSegment } = require('../_utils/segment')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('/', async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const segments = await Segment.find()
  res.status(200).json({ segments })
})

router.get('/next', async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  validateSessions()
  const lowestEpisodes = await Episode.find({ completed: false }).sort({ number: -1 })
  if (lowestEpisodes.length === 0) return res.status(200).json({ message: 'All episodes complete' })
  const segment = await nextSegment(lowestEpisodes)
  res.status(200).json({ segment })
})

module.exports = router
