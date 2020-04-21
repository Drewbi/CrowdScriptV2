const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllSegments, createSegment, getNextSegment } = require('../_controllers/segment')
const { deleteOldSessions } = require('../_controllers/session')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('*', verifyAdmin, getAllSegments)

router.post('*', verifyUser, validateFields(['number', 'text', 'episode', 'time']), createSegment)

router.get('/next', verifyUser, deleteOldSessions, getNextSegment)

module.exports = router
