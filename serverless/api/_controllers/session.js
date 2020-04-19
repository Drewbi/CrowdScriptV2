const mongoose = require('mongoose')
const Session = mongoose.model('Session')
const tenMinutes = 600000

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

const deleteOldSessions = (req, res, next) => {
  Session.deleteMany({ created_at: { $gte: tenMinutes } }).then(() => next()).catch(err => {
    console.log(err)
    next()
  })
}

module.exports = { createSession, removeSession, deleteOldSessions }
