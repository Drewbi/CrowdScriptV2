const { Router, json } = require('express')
const router = Router()
router.use(json())

const { getAllEpisodes, createEpisode, deleteEpisode } = require('../_controllers/episode')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('*', verifyUser, getAllEpisodes)

router.post('*', verifyAdmin, validateFields(['number', 'name', 'src']), createEpisode)

router.delete('*', verifyAdmin, validateFields(['number']), deleteEpisode)

module.exports = router
