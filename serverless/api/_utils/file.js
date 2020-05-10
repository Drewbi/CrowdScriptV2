const crypto = require('crypto')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  region: 'ap-southeast-2',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID
})

const config = {
  bucket_name: 'crowdscriptttt',
  uploadExpiry: 60 * 10, // 10 min
  downloadExpiry: 60 * 60 * 24 * 10, // 10 days
  fileMinSize: 100,
  fileMaxSize: 8 * 1000 * 1000 * 1000 // 1 Gb
}

const generateUUID = (size = 15) => {
  return crypto.randomBytes(Math.ceil(size * 3 / 4))
    .toString('base64')
    .slice(0, size)
    .replace(/\+/g, 'a')
    .replace(/\//g, 'b')
}

const getDownloadLink = async (key) => {
  const params = {
    Bucket: config.bucket_name,
    Key: key
  }
  await s3.headObject(params).promise() // key exists?
  return s3.getSignedUrl('getObject', params)
}

const generateKey = (contentType) => {
  if (contentType === 'audio/mpeg') return `${generateUUID()}.mp3`
  else if (contentType === 'text/plain') return `${generateUUID()}.srt`
  else throw new Error('Invalid content type')
}

const getUploadLink = async (key, contentType) => {
  const params = {
    Bucket: config.bucket_name,
    Fields: {
      key
    },
    Expires: config.uploadExpiry,
    Conditions: [
      {
        bucket: config.bucket_name
      },
      {
        key // our generated key
      },
      {
        acl: 'private' // private bucket
      },
      {
        'Content-Type': contentType
      },
      ['content-length-range', config.fileMinSize, config.fileMaxSize]
    ]
  }

  const signedPost = await s3.createPresignedPost(params)

  Object.assign(signedPost,
    {
      'Content-Type': contentType,
      acl: 'private'
    }
  )
  return signedPost
}

const deleteLink = (key) => {
  const params = {
    Bucket: config.bucket_name,
    Key: key
  }
  return s3.deleteObject(params).promise()
}

module.exports = { getDownloadLink, generateKey, getUploadLink, deleteLink }
