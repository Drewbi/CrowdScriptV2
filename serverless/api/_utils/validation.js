const mongoose = require('./mongoose')
const Session = mongoose.model('Session')
const tenMinutes = 600000

exports.validateFields = (fields) => (req, res, next) => {
  const invalid = fields.some(field => !req.body[field])
  invalid
    ? res.status(400).json({ message: 'Invalid user data' })
    : next()
}

exports.validateSessions = (req, res, next) => {
  Session.deleteMany({ created_at: { $gte: tenMinutes } }).then(() => next())
}