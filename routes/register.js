const userController = require('../controllers/users');
const router = require('express').Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    userController.create;
    console.log('User created');
});

module.exports = router;
