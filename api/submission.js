const mongoose = require('./_utils/mongoose')
require('./_models/submission')
const { routeHandler } = require('./_utils/router')
const { verifyUser, verifyAdmin } = require('./_utils/restrict')
const Submission = mongoose.model("Submission");

module.exports = (req, res) => {
  routeHandler(req, res, router)
}

const getSubmissions = async (req, res) => {
  if(!verifyUser(req)) return res.status(401).json({ message: "Requires user authorisation"})
  const submissions = await Submission.find();
  res.status(200).json({ submissions })
}

const addSubmission = async (req, res) => {
  if(!verifyUser(req)) return res.status(401).json({ message: "Requires user authorisation"})
  const { text } = req.body
  if( !text ) return res.status(400).json({ message: 'Invalid submission data' })
  
  const submission = new Submission();
  submission.text = text;
  
  submission.save()
  .then(submission => res.status(200).json({ submission }))
  .catch(err => {
    res.status(400).json({ message: 'Error adding submission', error: err });
  })
}

const deleteSubmission = async (req, res) => {
  if(!verifyAdmin(req)) return res.status(401).json({ message: "Requires admin authorisation"})
  const { id } = req.body
  if(!id) return res.status(400).json({ message: "Must supply submission number delete"})
  const result = await User.deleteOne({ number });
  res.status(200).json({ result })
}

const router = {
  GET: getSubmissions,
  POST: addSubmission,
  DELETE: deleteSubmission
}