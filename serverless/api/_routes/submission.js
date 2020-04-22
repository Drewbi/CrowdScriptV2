const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllSubmissions, verifySubmission, createSubmission, deleteSubmission } = require('../_controllers/submission')
const { validateFields } = require('../_utils/validation')
const { deleteOldSessions } = require('../_controllers/session')
const { setUser, verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('/api/submission', setUser, verifyUser, getAllSubmissions)

router.post('/api/submission', setUser, verifyUser, validateFields(['text', 'segment']), deleteOldSessions, verifySubmission, createSubmission)

router.delete('/api/submission', setUser, verifyAdmin, validateFields(['id']), deleteSubmission)

module.exports = router
