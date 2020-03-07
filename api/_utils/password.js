const crypto = require("crypto");

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex")
};

const generateHash = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
};

const validatePassword = (password, user) => {
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
    .toString("hex");
  return user.hash === hash;
};

module.exports = { generateSalt, generateHash, validatePassword }