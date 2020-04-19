exports.validateFields = (fields) => (req, res, next) => {
  const invalid = fields.some(field => !req.body[field])
  invalid
    ? res.status(400).json({ message: 'Invalid user data' })
    : next()
}
