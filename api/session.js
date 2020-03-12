const mongoose = require('./_utils/mongoose')
require('./_models/session')

const Session = mongoose.model('Session')

module.exports = async (req, res) => {
  // if(!verifyUser(req)) return res.status(401).json({ message: "Requires user authorisation"})
  const sessions = await Session.find()
  res.status(200).json({ sessions })
}
