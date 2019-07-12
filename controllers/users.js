const User = require('../models').User;

module.exports = {
  list(req, res) {
    return User
    .findAll({
      attributes: ['name', 'id']
    });
  },
  create(req, res) {
    return User
      .create({
        name: req.body.name,
        credit: req.body.credit
      })
  },  
};