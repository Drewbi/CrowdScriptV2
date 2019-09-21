const mongoose = require("mongoose");

const Session = mongoose.model("Session");

module.exports.createSession = req, segmentID => {
  const session = new Session();

  session.user = req.user._id;
  session.currentSegment = segmentID;
  session.save(err => {
    if (err) {
      console.error("Error creating session");
    }
  });
};