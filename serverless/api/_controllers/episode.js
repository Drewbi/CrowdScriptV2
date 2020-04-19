const mongoose = require('mongoose')
const Episode = mongoose.model('Episode')

const getAllEpisodes = async (req, res) => {
  const episodes = await Episode.find()
  return res.status(200).json({ episodes })
}

const createEpisode = (req, res) => {
  const { number, name, src } = req.body
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
}

const deleteEpisode = async (req, res) => {
  const { number } = req.body
  const result = await Episode.deleteOne({ number })
  return res.status(200).json({ result })
}

module.exports = { getAllEpisodes, createEpisode, deleteEpisode }
