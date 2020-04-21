const { Router, json } = require('express')
const router = Router()
router.use(json())

const { validateFields } = require('../_utils/validation')
const { getAllUsers, createUser, deleteUser } = require('../_controllers/user')
const { verifyUser, verifyAdmin } = require('../_utils/restrict')

router.get('/current', verifyUser, getUserFromToken)

router.get('/:id', verifyAdmin, getUserFromId)

router.get('*', verifyAdmin, getAllUsers)

router.post('*', validateFields(['name', 'email', 'credit', 'password']), createUser)

router.delete('*', verifyAdmin, validateFields(['email']), deleteUser)

module.exports = router
