const router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Episode endpoint');
});

module.exports = router;
