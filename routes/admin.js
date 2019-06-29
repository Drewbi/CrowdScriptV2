const userController = require('../controllers/users');
const submissionController = require('../controllers/submissions');

const router = require('express').Router();

/* GET admin portal. */
router.get('/', function(req, res, next) {
  res.render('admin', {
    title: 'Admin', 
    Users:   userController.list(),
    Submissions: submissionController.list });
});

module.exports = router;
