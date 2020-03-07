const mongoose = require('./_utils/mongoose')
require('./_models/user')
const { routeHandler } = require('./_utils/router')
const { validatePassword } = require('./_utils/password')
const { sign } = require('./_utils/jwt')
const User = mongoose.model("User");

module.exports = (req, res) => {
  routeHandler(req, res, router)
}

const authUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  
  if(!user) return res.status(404).json({ message : "Email not registered"})
  const passwordCorrect = validatePassword(password, user)
  if (!passwordCorrect) return res.status(400).json({ message : "Password Incorrect"})

  config.subject = user.email
  config.audience = req.headers.host
  const token = sign({ id: user._id, admin: user.admin }, config)
  res.status(200).json({ token })
}

const config = {
  issuer: "crowdscript",
}

const router = {
  POST: authUser
}
