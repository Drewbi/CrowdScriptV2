const mongoose = require('mongoose');
const crypto = require('crypto');

const { ObjectId } = mongoose.Schema.Types;

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
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  submission: [{
    type: ObjectId,
    ref: 'Submission'
  }]
});

userSchema.pre('remove', function(next) {
  this.model('Submission').deleteMany({ user: this._id }, next);
  this.model('Session').deleteMany({ user: this._id }, next);
});

userSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function validatePassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

mongoose.model('User', userSchema);