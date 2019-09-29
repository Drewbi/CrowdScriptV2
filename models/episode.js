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
  ],
  completed: {
    type: Boolean,
    required: true
  },
  passCompleted: {
    type: Number,
    required: true,
    default: 0
  }
});

episodeSchema.pre("remove", function(next) {
  this.model("Segment").deleteMany({ episode: this._id }, next);
});

episodeSchema.methods.markComplete = () => {
  this.completed = true;
  this.passCompleted = this.passCompleted + 1;
}

mongoose.model("Episode", episodeSchema);
