const router = require('express').Router();
const submissionController = require('../controllers/submissions');

router.get('/', submissionController.list);

router.post('/', submissionController.create);

module.exports = router;
