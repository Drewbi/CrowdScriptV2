const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const episodeSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
    index: true,
    unique: true,
    min: 1
  },
  name: {
    type: String,
    required: true
  },
  segment: [
    {
      type: ObjectId,
      ref: "Segment"
    }
  ]
});

episodeSchema.pre("remove", function(next) {
  this.model("Segment").deleteMany({ episode: this._id }, next);
});

mongoose.model("Episode", episodeSchema);
