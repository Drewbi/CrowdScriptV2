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
  submission: [
    {
      type: ObjectId,
      ref: 'Submission'
    }
  ]
})

userSchema.pre('remove', (next) => {
  this.model('Submission').deleteMany({ user: this.id }, next)
  this.model('Session').deleteMany({ user: this.id }, next)
})

module.exports = mongoose.model('User', userSchema)
