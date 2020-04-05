const express = require('express')
const app = express()
app.use(express.json())

require('./_utils/mongoose')
const Submission = require('./_models/submission')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')

app.get('/', async (req, res, next) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const submissions = await Submission.find()
  return res.status(200).json({ submissions })
})

app.post('/', (req, res, next) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const { text } = req.body
  if (!text) return res.status(400).json({ message: 'Invalid submission data' })

  const submission = new Submission()
  submission.text = text

  return submission.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding submission', error: err })
    })
})

app.delete('/', async (req, res, next) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { id } = req.body
  if (!id) return res.status(400).json({ message: 'Must supply submission number delete' })
  const result = await Submission.deleteOne({ id })
  return res.status(200).json({ result })
})

module.exports = app
