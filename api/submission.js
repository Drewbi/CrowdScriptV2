const mongoose = require('./_utils/mongoose');
require('./_models/submission');
const { routeHandler } = require('./_utils/router');
const { verifyUser, verifyAdmin } = require('./_utils/restrict');

const Submission = mongoose.model('Submission');

const getSubmissions = async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' });
  const submissions = await Submission.find();
  return res.status(200).json({ submissions });
};

const addSubmission = async (req, res) => {
  if (!verifyUser(req)) return res.status(401).json({ message: 'Requires user authorisation' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Invalid submission data' });

  const submission = new Submission();
  submission.text = text;

  return submission.save()
    .then((result) => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding submission', error: err });
    });
};

const deleteSubmission = async (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ message: 'Requires admin authorisation' });
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'Must supply submission number delete' });
  const result = await Submission.deleteOne({ id });
  return res.status(200).json({ result });
};

const router = {
  GET: getSubmissions,
  POST: addSubmission,
  DELETE: deleteSubmission,
};

module.exports = (req, res) => {
  routeHandler(req, res, router);
};
