const { Router, json } = require('express')
const router = Router()
router.use(json())

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { getAllEpisodes, createEpisode, deleteEpisode } = require('../_controllers/episode')
const { generateSegments } = require('../_controllers/segment')
const { setUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('/api/episode', setUser, verifyAdmin, getAllEpisodes)

router.post('/api/episode', setUser, verifyAdmin, upload.single('srt'), validateFields(['number', 'name', 'src']), createEpisode, generateSegments)

router.delete('/api/episode', setUser, verifyAdmin, validateFields(['number']), deleteEpisode)

module.exports = router
