const User = require('../models').User;

module.exports = {
  list(req, res) {
    return User
    .findAll({
      attributes: ['name', 'id']
    });
    // .then(users => res.status(201).send(users))
    // .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    return User
      .create({
        name: req.body.name,
        credit: req.body.credit,
        ip: 'IP'
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },  
};