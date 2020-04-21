const mongoose = require('mongoose')
const User = mongoose.model('User')

const { generateSalt, generateHash } = require('../_utils/password')

const getAllUsers = async (req, res, next) => {
  const users = await User.find()
  return res.status(200).json({ users })
}

const createUser = (req, res, next) => {
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
}

const deleteUser = async (req, res, next) => {
  const { email } = req.body
  const result = await User.deleteOne({ email })
  return result.ok === 1
    ? res.status(200).json({ message: 'Successfully deleted user' })
    : res.status(400).json({ message: 'Failed to delete user' })
}

module.exports = { createUser, getAllUsers, deleteUser }
