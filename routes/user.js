const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', (req, res) => {
    userController.list()
        .then(data => {
            let userArray = data.map(user => user.dataValues);
            console.log(userArray);
            res.render('index', {title: '/user', message: 'User find', userData: userArray});
        })
        .catch(error => {
            res.render('index', {title: '/user', message: error});
        })
});

router.post('/', (req, res) => {
    userController.create()
        .then(data => {
            console.log(data);
            res.render('index', {title: '/user', message: 'User create', userData: data});
        }).catch(error => {
            res.render('index', {title: '/user', message: error});
        })
    });

module.exports = router;