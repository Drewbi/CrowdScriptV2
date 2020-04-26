const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')
const Segment = mongoose.model('Segment')

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
  const { id: submissionId } = req.body
  const { segment: segmentId } = await Submission.findById(submissionId)
  const segment = await Segment.findById(segmentId)
  const sessionIndex = segment.submissions.indexOf(submissionId)
  segment.submissions.splice(sessionIndex, 1)
  await segment.save()
  const result = await Submission.deleteOne({ _id: submissionId })

  return res.status(200).json({ result })
}

module.exports = { getAllSubmissions, verifySubmission, createSubmission, deleteSubmission }
