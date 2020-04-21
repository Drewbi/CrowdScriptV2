const { decode, verify, retrieve } = require('./jwt')

const verifyJWT = (req) => {
  if (!req.headers.authorization) return null
  const token = retrieve(req.headers.authorization)
  const payload = decode(token) ? decode(token).payload : null
  if (!payload) return null
  const subject = payload.sub
  const audience = req.headers.host
  if (verify(token, { issuer: 'crowdscript', subject, audience })) return payload
  return null
}

const verifyAdmin = (req, res, next) => {
  const payload = verifyJWT(req)
  payload && payload.admin
    ? next()
    : res.status(401).json({ message: 'Requires admin authorisation' })
}

const verifyUser = (req, res, next) => {
  const payload = verifyJWT(req)
  payload
    ? next()
    : res.status(401).json({ message: 'Requires user authorisation' })
}

const getIdFromJWT = (req) => {
  const { id } = verifyJWT(req)
  return id || null
}

module.exports = { verifyUser, verifyAdmin, getIdFromJWT }
