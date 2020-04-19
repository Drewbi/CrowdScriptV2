const mongoose = require('./mongoose')
const Session = mongoose.model('Session')

const createSession = async (userId, segment) => {
  const session = new Session()
  session.user = userId
  session.segment = segment
  await session.save()
  return session
}

const removeSession = async (userId) => {
  const session = await Session.findOneAndDelete({ userId })
  return session
}

module.exports = { createSession, removeSession, validateSessions }
