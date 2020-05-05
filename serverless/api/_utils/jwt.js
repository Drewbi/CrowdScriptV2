const jwt = require('jsonwebtoken')

const privateKEY = process.env.VERCEL_URL ? process.env.PRIVATE_KEY : Buffer.from(process.env.PRIVATE_KEY, 'base64').toString()
const publicKEY = process.env.VERCEL_URL ? process.env.PUBLIC_KEY : Buffer.from(process.env.PUBLIC_KEY, 'base64').toString()

module.exports = {
  sign: (payload, $Options) => {
  /*
  sOptions = {
    issuer: "Authorizaxtion/Resource/This server",
    subject: "iam@user.me",
    audience: "Client_Identity" // this should be provided by client
  }
  */ // Token signing options
    const signOptions = {
      issuer: $Options.issuer,
      subject: $Options.subject,
      audience: $Options.audience,
      expiresIn: '10d', // 10 days validity
      algorithm: 'RS256'
    }
    return jwt.sign(payload, privateKEY, signOptions)
  },

  verify: (token, $Option) => {
    /*
  vOption = {
      issuer: "Authorization/Resource/This server",
      subject: "iam@user.me",
      audience: "Client_Identity" // this should be provided by client
    }
    */
    const verifyOptions = {
      issuer: $Option.issuer,
      subject: $Option.subject,
      audience: $Option.audience,
      expiresIn: '10d',
      algorithm: ['RS256']
    }; try {
      return jwt.verify(token, publicKEY, verifyOptions)
    } catch (err) {
      console.log(err)
      return false
    }
  },

  decode: token => jwt.decode(token, { complete: true }), // returns null if token is invalid

  retrieve: (string) => {
    const regex = /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/
    const token = string.match(regex)
    if (!token) return null
    return token[0]
  }
}
