const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.addUser = (req, res) => {
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.credit = req.body.credit;
  user.setPassword(req.body.password);

  user.save((err) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.redirect('/');
    }

  });
};