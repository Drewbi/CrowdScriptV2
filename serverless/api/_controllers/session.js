const mongoose = require('mongoose')
const Session = mongoose.model('Session')
const tenMinutes = 600000

const findSessionByUser = async (userId) => {
  const session = await Session.findOne({ user: userId })
  return session
}

const createSession = async (userId, segmentId) => {
  const oldSession = await Session.findOne({ user: userId })
  if (oldSession) return oldSession
  const session = new Session()
  session.user = userId
  session.segment = segmentId
  await session.save()
  return session
}

const removeSession = async (userId) => {
  const session = await Session.findOneAndDelete({ user: userId })
  return session
}

const deleteOldSessions = async (req, res, next) => {
  try {
    await Session.deleteMany({ created_at: { $lte: Date.now() - tenMinutes } })
    next()
  } catch (err) {
    console.log(err)
    next()
  }
}

module.exports = { findSessionByUser, createSession, removeSession, deleteOldSessions }
