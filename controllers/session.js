const mongoose = require("mongoose");

const Session = mongoose.model("Session");

module.exports.getSessionByUser = (userId) => {
  return Session.find({ user: userId });
}

module.exports.createSession = (req, segmentId) => {
  console.log("Creating session " + req.user._id);
  const session = new Session();
  session.user = req.user._id;
  session.segment = segmentId;
  session.save(err => {
    if (err) {
      console.error("Error creating session");
      console.log(err);
    }
  });
};

module.exports.discardSession = (userId) => {
  console.log("Discarding session for " + userId);
  Session.findOne({ user: userId }).then((session) => {
    session.deleteOne();
  });
}

module.exports.checkSegment = (segmentId) => {
  return new Promise((resolve, reject) => {
    Session.findOne({ segment: segmentId})
    .then(session => {
      if(!session) return resolve(true);
      if(Date.now() - session.created_at > 300000){
        console.log("Deleted expired session");
        session.deleteOne();
        return resolve(true);
      }
      return resolve(false);
    });
  })
}