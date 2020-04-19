const { Router, json } = require('express')
const router = Router()
router.use(json())

const mongoose = require('mongoose')
const User = mongoose.model('User')

const { generateSalt, generateHash } = require('../_utils/password')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('*', verifyUser, async (req, res) => {
  const users = await User.find()
  return res.status(200).json({ users })
})

router.post('*', validateFields(["name", "email", "credit", "password"]), (req, res) => {
  const {
    name, email, credit, password
  } = req.body
  const user = new User()
  user.name = name
  user.email = email
  user.credit = credit
  const salt = generateSalt()
  user.salt = salt
  user.hash = generateHash(password, salt)
  return user.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      if (err.code === 11000) return res.status(409).json({ message: 'Email already registered' })
      return res.status(400).json({ message: 'Error registering', error: err })
    })
})

router.delete('*', verifyAdmin, validateFields(["email"]), async (req, res) => {
  const { email } = req.body
  const result = await User.deleteOne({ email })
  return result.ok === 1 ? res.status(200).json({ message: 'Successfully deleted user' }) : res.status(400).json({ message: 'Failed to delete user' })
})

module.exports = router
