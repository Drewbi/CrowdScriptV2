const express = require('express');
const { addUser } = require('../controllers/users')
const router = express.Router();

/* GET register page. */
router.get('/', (req, res) => {
  res.render('register', {
    title: 'Register',
  });
});

router.post('/', (req, res) => {
  console.log('"Registering" User');
  addUser(req, res);
  res.redirect('/');
})

module.exports = router;