const mongoose = require("mongoose");

const Submission = mongoose.model("Submission");

module.exports.getSubmissions = () => {
  return Submission.find({});
};

module.exports.getSubmissionById = (_id) => {
  return Submission.find({ _id });
};

module.exports.createSubmission = (req, segmentId, pass)  => {
  const submission = new Submission();
  submission.pass = pass;
  submission.segment = segmentId;
  submission.text = req.body.text;
  submission.user = req.user._id;
  submission.save(err => {
    if (err) {
      console.error("Error creating submission " + err);
    }
  });
  return submission;
};