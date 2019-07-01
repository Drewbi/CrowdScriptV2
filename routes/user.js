const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', (req, res) => {
    userController.list()
        .then(data => {
            let userArray = data.map(user => user.dataValues);
            console.log(userArray);
            res.render('index', {userData: userArray[0].name});
        })
});

router.post('/', userController.create);

module.exports = router;