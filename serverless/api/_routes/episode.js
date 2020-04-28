const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllEpisodes, createEpisode, deleteEpisode } = require('../_controllers/episode')
const { setUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('/api/episode', setUser, verifyAdmin, getAllEpisodes)

router.post('/api/episode', setUser, verifyAdmin, validateFields(['number', 'name', 'src']), createEpisode)

router.delete('/api/episode', setUser, verifyAdmin, validateFields(['number']), deleteEpisode)

module.exports = router
