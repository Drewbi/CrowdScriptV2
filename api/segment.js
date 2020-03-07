const mongoose = require('./_utils/mongoose')
require('./_models/segment')
const Segment = mongoose.model("Segment");

module.exports = async (req, res) => {
  const segments = await Segment.find();
  res.status(200).json({ segments })
}
