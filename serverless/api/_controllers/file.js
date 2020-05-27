const { getDownloadLink, generateKey, getUploadLink, deleteLink } = require('../_utils/file')

const createDownloadLink = async (req, res) => {
  const { key } = req.params
  try {
    const url = await getDownloadLink(key)
    return res.status(200).json({ url })
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ error: 'File not found' })
    } else {
      res.status(500).json({ error: err })
    }
  }
}

const createUploadLink = async (req, res) => {
  const { contentType } = req.body
  try {
    const s3key = generateKey(contentType)
    const signedData = await getUploadLink(s3key, contentType)
    res.status(200).json(signedData)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteUpload = async (req, res) => {
  const { key } = req.params
  try {
    await deleteLink(key)
    res.status(200).json({ message: 'File deleted' })
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ error: 'File not found' })
    res.status(500).json({ error: 'Could not delete' })
  }
}

module.exports = { createDownloadLink, createUploadLink, deleteUpload }
