const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  credit: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  submissions: [
    {
      type: ObjectId,
      ref: 'Submission'
    }
  ]
})

userSchema.pre('deleteOne', { document: true, query: false }, async function (query, next) {
  const Submission = mongoose.model('Submission')
  const submissions = await Submission.find({ user: this._id })
  await Promise.all(submissions.map(submission => submission.deleteOne()))
})

module.exports = mongoose.model('User', userSchema)
