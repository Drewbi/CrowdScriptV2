const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')

const { getUserFromJWT } = require('../_utils/restrict')

const getAllSubmissions = async (req, res) => {
  const submissions = await Submission.find()
  return res.status(200).json({ submissions })
}

const createSubmission = async (req, res) => {
  const { text } = req.body
  const submission = new Submission()
  submission.text = text
  submission.user = getUserFromJWT(req)
  try {
    const result = await submission.save()
    return res.status(200).json({ result })
  } catch (err) {
    res.status(400).json({ message: 'Error adding submission', error: err })
  }
}

const deleteSubmission = async (req, res) => {
  const { id } = req.body
  const result = await Submission.deleteOne({ id })
  return res.status(200).json({ result })
}

module.exports = { getAllSubmissions, createSubmission, deleteSubmission }
