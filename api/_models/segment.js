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
  episode: {
    type: ObjectId,
    ref: "Episode"
  },
  submissions: [
    {
      type: ObjectId,
      ref: "Submission"
    }
  ]
});

segmentSchema.pre("remove", (next) => {
  this.model("Submission").deleteMany({ segment: this._id }, next);
});

mongoose.model("Segment", segmentSchema);