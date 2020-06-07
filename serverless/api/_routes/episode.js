const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllEpisodes, getEpisode, createEpisode, deleteEpisode } = require('../_controllers/episode')
const { generateSegments } = require('../_controllers/segment')
const { setUser, verifyAdmin, verifyUser } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('/api/episode', setUser, verifyAdmin, getAllEpisodes)

router.get('/api/episode/:id', setUser, verifyUser, getEpisode)

router.post('/api/episode', setUser, verifyAdmin, validateFields(['number', 'name', 'src', 'srt']), createEpisode, generateSegments)

router.delete('/api/episode', setUser, verifyAdmin, validateFields(['number']), deleteEpisode)

module.exports = router
