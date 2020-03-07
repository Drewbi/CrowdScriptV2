const { decode, verify, retrieve } = require('./jwt')

const verifyAdmin = (req) => {
  const payload = verifyJWT(req)
  if(payload) return payload.admin
  return false
}

const verifyUser = (req) => {
  const payload = verifyJWT(req)
  return !!payload
}

const verifyJWT = (req) => {
  if(!req.headers.authorization) return null
  const token = retrieve(req.headers.authorization)
  const payload = decode(token) ? decode(token).payload : null
  if(!payload) return null
  const subject = payload.sub
  const audience = req.headers.host
  if(verify(token, { issuer:  "crowdscript", subject, audience})) return payload
  else return null
}

module.exports = { verifyUser, verifyAdmin }