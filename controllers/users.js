const User = require('../models').User;
const db = require('../models');
module.exports = {
  list() {
    return db.sequelize.query("SELECT * FROM \"Users\"").then(([results, metadata]) => {
      // Results will be an empty array and metadata will contain the number of affected rows.
      return results;
    })
    // User
    // .findAll({
    //   attributes: ['name', 'id']
    // })
    // .then(users => console.log(JSON.stringify(users)))
    // .catch(error => console.log(error));
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