const { Router, json } = require('express')
const router = Router()
router.use(json())

const mongoose = require('mongoose')
const Episode = mongoose.model('Episode')

const { verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('*', async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const episodes = await Episode.find()
  return res.status(200).json({ episodes })
})

router.post('*', (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { number, name, src } = req.body
  if (!number || !name || !src) return res.status(400).json({ message: 'Invalid episode data' })

  const episode = new Episode()
  episode.number = number
  episode.name = name
  episode.src = src
  episode.completed = false

  return episode.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding episode', error: err })
    })
})

router.delete('*', async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { number } = req.body
  if (!number) return res.status(400).json({ message: 'Must supply episode number delete' })
  const result = await Episode.deleteOne({ number })
  return res.status(200).json({ result })
})

module.exports = router
