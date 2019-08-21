const mongoose = require("mongoose");

const Submission = mongoose.model("Submission");

module.exports.getSubmissions = () => {
  return Submission.find({});
};

module.exports.createSubmissions = req => {
  const submission = new Submission();

  submission.text = req.body.text;
  submission.user = req.user._id;
  submission.save(err => {
    if (err) {
      console.error("Error creating submission");
    }
  });
};
