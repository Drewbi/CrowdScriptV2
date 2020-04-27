const { Router, json } = require('express')
const router = Router()
router.use(json())

const { validateFields } = require('../_utils/validation')
const { getAllUsers, getUserById, getUserFromJWT, createUser, deleteUser } = require('../_controllers/user')
const { setUser, verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('/api/user/current', setUser, verifyUser, getUserFromJWT)

router.get('/api/user/:id', setUser, verifyAdmin, getUserById)

router.get('/api/user', setUser, verifyAdmin, getAllUsers)

router.post('/api/user', validateFields(['name', 'email', 'credit', 'password']), createUser)

router.delete('/api/user', setUser, verifyAdmin, validateFields(['email']), deleteUser)

module.exports = router
