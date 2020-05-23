const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')

const { findSessionByUser, removeSession } = require('../_controllers/session')

const getAllSubmissions = async (req, res) => {
  const submissions = await Submission.find()
  return res.status(200).json({ submissions })
}

const getEpisodeSubmissions = async (req, res) => {
  const { id } = req.params
  try {
    const submissions = await Submission.find({ episode: id })
    res.status(200).json({ submissions })
  } catch (err) {
    if (err.name === 'CastError') res.status(401).json({ message: 'Invalid Id' })
    else res.status(400).json({ message: 'Error occured finding submission' })
  }
}

const getUserSubmissions = async (req, res) => {
  const { id } = req.params
  try {
    const submissions = await Submission.find({ user: id })
    res.status(200).json({ submissions })
  } catch (err) {
    if (err.name === 'CastError') res.status(401).json({ message: 'Invalid Id' })
    else res.status(400).json({ message: 'Error occured finding submission' })
  }
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
    console.log(err)
    res.status(400).json({ message: 'Error adding submission' })
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

module.exports = { getAllSubmissions, getEpisodeSubmissions, getUserSubmissions, verifySubmission, createSubmission, deleteSubmission }
