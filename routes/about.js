const express = require('express');
const { addUser } = require('../controllers/users')
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('about', {
    title: 'About',
  });
});

router.post('/', (req, res) => {
  addUser(req, res);
})

module.exports = router;