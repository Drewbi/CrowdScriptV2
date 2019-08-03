const express = require('express');
const { addUser } = require('../controllers/users')
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('Register');
});

router.post('/', (req, res) => {
  addUser(req, res);
  res.redirect('/');
})

module.exports = router;