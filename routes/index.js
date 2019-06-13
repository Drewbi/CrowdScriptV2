var express = require('express');
var router = express.Router();

var landing = require('../controllers/landing');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CrowdScript' });
});

module.exports = router;
