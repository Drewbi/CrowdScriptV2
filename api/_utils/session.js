const mongoose = require('./mongoose')
const Session = mongoose.model('Session')
const tenMinutes = 600000

const validateSessions = async () => {
  const result = await Session.deleteMany({ created_at: { $gte: tenMinutes } })
  return result
}

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
