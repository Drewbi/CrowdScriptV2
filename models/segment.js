const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const segmentSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  passes: {
    type: Number,
    default: 0
  },
  episode: {
    type: ObjectId,
    ref: "Episode"
  },
  submission: [
    {
      type: ObjectId,
      ref: "Submission"
    }
  ]
});

segmentSchema.pre("remove", function(next) {
  this.model("Submission").deleteMany({ segment: this._id }, next);
});

mongoose.model("Segment", segmentSchema);
