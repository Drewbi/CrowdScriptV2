const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports.addUser = (req, res) => {
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.credit = !!req.body.credit;
  user.setPassword(req.body.password);
  user.save((err) => {
    if (err) {
      console.error('Error registering user');
      res.redirect('/register');
    }
  });
};

module.exports.validateUser = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (user.admin) { return res.redirect('/admin'); }
      return res.redirect('/');
    });
  })(req, res, next);
};

module.exports.getAllUsers = () => {
  return User.find({});
}