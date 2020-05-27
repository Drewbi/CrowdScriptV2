const { Router, json } = require('express')
const router = Router()
router.use(json())

const { createDownloadLink, createUploadLink, deleteUpload } = require('../_controllers/file')
const { setUser, verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('/api/file/:key', setUser, verifyUser, createDownloadLink)

router.post('/api/file', setUser, verifyAdmin, validateFields(['contentType']), createUploadLink)

router.delete('/api/file/:key', setUser, verifyAdmin, deleteUpload)

module.exports = router
