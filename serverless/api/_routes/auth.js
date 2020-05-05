const { Router, json } = require('express')
const router = Router()
router.use(json())

const mongoose = require('mongoose')
const User = mongoose.model('User')

const { validatePassword } = require('../_utils/password')
const { sign } = require('../_utils/jwt')

const config = {
  issuer: 'crowdscript'
}

router.post('/api/authentication', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) return res.status(404).json({ message: 'Email not registered' })
  const passwordCorrect = validatePassword(password, user)
  if (!passwordCorrect) return res.status(400).json({ message: 'Password Incorrect' })

  config.subject = user.email
  config.audience = process.env.VERCEL_URL || req.headers.host
  const token = sign({ id: user.id, admin: user.admin }, config)
  const expiry = Date.now() + 10 * 24 * 60 * 60 * 1000
  return res.status(200).json({ token, expiry })
})

module.exports = router
