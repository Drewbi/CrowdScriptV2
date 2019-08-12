const express = require('express');
const { getAllUsers } = require('../controllers/users')
const { getSubmissions } = require('../controllers/submissions')
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  getAllUsers().then((users) => {
    const usersData = users.map(user => {
      const {name, email } = user;
      return { name, email }; 
    });
    getSubmissions().then((submissions) => {
      res.render('admin', { title: 'Admin', Submissions: submissions, Users: usersData});
    })
  })
});

module.exports = router;