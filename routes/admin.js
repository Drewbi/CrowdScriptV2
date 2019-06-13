var express = require('express');
var router = express.Router();

/* GET admin portal. */
router.get('/admin', function(req, res, next) {
  res.send('Admin page');
});

module.exports = router;
