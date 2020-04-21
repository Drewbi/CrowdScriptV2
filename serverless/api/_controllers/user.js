const mongoose = require('mongoose')
const User = mongoose.model('User')

const { generateSalt, generateHash } = require('../_utils/password')
const { getIdFromJWT } = require('../_utils/restrict')

const getAllUsers = async (req, res, next) => {
  const users = await User.find()
  return res.status(200).json({ users })
}

const getUserById = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ _id: id })
    if (!user) res.status(404).json({ message: 'Unable to find user' })
    res.status(200).json({ user })
  } catch (err) {
    if (err.name === 'CastError') res.status(401).json({ message: 'Invalid Id' })
    else res.status(400).json({ message: 'Unable to find user' })
  }
}

const getUserFromJWT = async (req, res, next) => {
  const id = getIdFromJWT(req)
  try {
    const user = await User.findOne({ _id: id })
    if (!user) res.status(404).json({ message: 'Unable to find user' })
    res.status(200).json({ user })
  } catch (err) {
    if (err.name === 'CastError') res.status(401).json({ message: 'Invalid Id' })
    else res.status(400).json({ message: 'Unable to find user' })
  }
}

const createUser = async (req, res, next) => {
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
  try {
    const result = await user.save()
    return res.status(200).json({ result })
  } catch (err) {
    if (err.code === 11000) { return res.status(409).json({ message: 'Email already registered' }) }
    return res.status(400).json({ message: 'Error registering', error: err })
  }
}

const deleteUser = async (req, res, next) => {
  const { email } = req.body
  const result = await User.deleteOne({ email })
  return result.ok === 1
    ? res.status(200).json({ message: 'Successfully deleted user' })
    : res.status(400).json({ message: 'Failed to delete user' })
}

module.exports = { getAllUsers, getUserById, getUserFromJWT, createUser, deleteUser }
