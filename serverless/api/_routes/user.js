const { Router, json } = require('express')
const router = Router()
router.use(json())

const { validateFields } = require('../_utils/validation')
const { getAllUsers, getUserById, createUser, deleteUser } = require('../_controllers/user')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('/api/user/current', verifyUser, getAllUsers)

router.get('/api/user/:id', verifyAdmin, getUserById)

router.get('/api/user', verifyAdmin, getAllUsers)

router.post('/api/user', validateFields(['name', 'email', 'credit', 'password']), createUser)

router.delete('/api/user', verifyAdmin, validateFields(['email']), deleteUser)

module.exports = router
