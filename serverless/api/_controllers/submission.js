const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')

const { findSessionByUser, removeSession } = require('../_controllers/session')

const getAllSubmissions = async (req, res) => {
  const submissions = await Submission.find()
  return res.status(200).json({ submissions })
}

const verifySubmission = async (req, res, next) => {
  const { segment } = req.body
  const userId = res.locals.user
  const session = await findSessionByUser(userId)
  if (session && session.segment.toString() === segment) next()
  else {
    session
      ? res.status(401).json({ message: 'Invalid segment' })
      : res.status(404).json({ message: 'User session expired' })
  }
}

const createSubmission = async (req, res) => {
  const { text, segment } = req.body
  const submission = new Submission()
  submission.text = text
  submission.user = res.locals.user
  submission.segment = segment
  try {
    const result = await submission.save()
    await removeSession(res.locals.user)
    res.status(200).json({ result })
  } catch (err) {
    res.status(400).json({ message: 'Error adding submission', error: err })
  }
}

const deleteSubmission = async (req, res) => {
  const { id } = req.body
  const submission = await Submission.findById(id)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  const result = await submission.deleteOne()
  return result
    ? res.status(200).json({ message: 'Successfully deleted submission' })
    : res.status(400).json({ message: 'Failed to delete submission' })
}

module.exports = { getAllSubmissions, verifySubmission, createSubmission, deleteSubmission }
