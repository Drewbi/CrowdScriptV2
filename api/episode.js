const mongoose = require('./_utils/mongoose')
require('./_models/episode')
const { routeHandler } = require('./_utils/router')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')

const Episode = mongoose.model('Episode')

const getEpisodes = async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const episodes = await Episode.find()
  return res.status(200).json({ episodes })
}

const addEpisode = (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { number, name, src } = req.body
  if (!number || !name || !src) return res.status(400).json({ message: 'Invalid episode data' })

  const episode = new Episode()
  episode.number = number
  episode.name = name
  episode.src = src

  return episode.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding episode', error: err })
    })
}

const deleteEpisode = async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { number } = req.body
  if (!number) return res.status(400).json({ message: 'Must supply episode number delete' })
  const result = await Episode.deleteOne({ number })
  return res.status(200).json({ result })
}

const router = {
  GET: getEpisodes,
  POST: addEpisode,
  DELETE: deleteEpisode
}

module.exports = (req, res) => {
  routeHandler(req, res, router)
}
