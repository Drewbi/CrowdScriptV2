const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllSubmissions, createSubmission, deleteSubmission } = require('../_controllers/submission')
const { validateFields } = require('../_utils/validation')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('*', verifyUser, getAllSubmissions)

router.post('*', verifyUser, validateFields(["text"]), createSubmission)

router.delete('*', verifyAdmin, validateFields(["id"]), deleteSubmission)

module.exports = router
