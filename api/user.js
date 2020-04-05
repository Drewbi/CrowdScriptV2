const express = require('express')
const app = express()
app.use(express.json())

require('./_utils/mongoose')
const User = require('./_models/user')
const { generateSalt, generateHash } = require('./_utils/password')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')

app.get('/', async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' })
  const users = await User.find()
  return res.status(200).json({ users })
})

app.post('/', (req, res) => {
  const {
    name, email, credit, password
  } = req.body
  if (!name || !email || !credit || !password) return res.status(400).json({ message: 'Invalid user data' })

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

app.delete('/', async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' })
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Must supply email of user to delete' })
  const result = await User.deleteOne({ email })
  return res.status(200).json({ result })
})

module.exports = app
