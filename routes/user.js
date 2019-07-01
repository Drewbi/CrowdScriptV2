const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', userController.list);

router.post('/', userController.create);

module.exports = router;