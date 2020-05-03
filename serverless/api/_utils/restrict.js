const { decode, verify, retrieve } = require('./jwt')

const verifyJWT = (req) => {
  if (!req.cookies.access_token && !req.headers.authorization) return null
  const token = retrieve(req.cookies.access_token || req.headers.authorization)
  const payload = decode(token) ? decode(token).payload : null
  if (!payload) return null
  const subject = payload.sub
  const audience = req.headers.host
  if (verify(token, { issuer: 'crowdscript', subject, audience })) return payload
  return null
}

const setUser = (req, res, next) => {
  const payload = verifyJWT(req)
  if (payload) {
    res.locals.user = payload.id
    res.locals.admin = payload.admin
  }
  next()
}

const verifyAdmin = (req, res, next) => {
  res.locals.admin
    ? next()
    : res.status(401).json({ message: 'Requires admin authorisation' })
}

const verifyUser = (req, res, next) => {
  res.locals.user
    ? next()
    : res.status(401).json({ message: 'Requires user authorisation' })
}

module.exports = { setUser, verifyUser, verifyAdmin }
