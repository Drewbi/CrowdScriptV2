const mongoose = require('./_utils/mongoose')
require('./_models/user')
const { routeHandler } = require('./_utils/router')
const { generateSalt, generateHash } = require('./_utils/password')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')
const User = mongoose.model("User");

module.exports = (req, res) => {
  routeHandler(req, res, router)
}

const getUsers = async (req, res) => {
  console.log(req);
  if(!verifyUser(req)) return res.status(401).json({ message: "Requires user authorisation"})
  const users = await User.find();
  res.status(200).json({ users })
}

const addUser = async (req, res) => {
  const { name, email, credit, password } = req.body
  if( !name || !email || !credit || !password )
    return res.status(400).json({ message: 'Invalid user data' })
  
  const user = new User();
  user.name = name;
  user.email = email;
  user.credit = credit;
  const salt = generateSalt()
  user.salt = salt
  user.hash = generateHash(password, salt)
  user.save()
  .then(user => res.status(200).json({ user }))
  .catch(err => {
    if(err.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    res.status(400).json({ message: 'Error registering', error: err });
  })
}

const deleteUser = async (req, res) => {
  if(!verifyAdmin(req)) return res.status(401).json({ message: "Requires admin authorisation"})
  const { email } = req.body
  if(!email) return res.status(400).json({ message: "Must supply email of user to delete"})
  const result = await User.deleteOne({ email });
  res.status(200).json({ result })
}

const router = {
  GET: getUsers,
  POST: addUser,
  DELETE: deleteUser
}