const express = require('express')
const app = express()
app.use(express.json())

require('./_utils/mongoose')
const Episode = require('./_models/episode')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')

app.get('/', async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const episodes = await Episode.find()
  return res.status(200).json({ episodes })
})

app.post('/', (req, res) => {
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

app.delete('/', async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { number } = req.body
  if (!number) return res.status(400).json({ message: 'Must supply episode number delete' })
  const result = await Episode.deleteOne({ number })
  return res.status(200).json({ result })
})

module.exports = app
