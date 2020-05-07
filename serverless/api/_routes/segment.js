const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllSegments, postSegment, getNextSegment, deleteSegment } = require('../_controllers/segment')
const { deleteOldSessions } = require('../_controllers/session')
const { setUser, verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('/api/segment', setUser, verifyAdmin, getAllSegments)

router.post('/api/segment', setUser, verifyAdmin, validateFields(['number', 'text', 'episode', 'time']), postSegment)

router.delete('/api/segment', setUser, verifyAdmin, validateFields(['id']), deleteSegment)

router.get('/api/segment/next', setUser, verifyUser, deleteOldSessions, getNextSegment)

module.exports = router
