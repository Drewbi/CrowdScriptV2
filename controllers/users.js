const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports.addUser = (req, res) => {
  console.log(req.body);
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.credit = !!req.body.credit;
  user.setPassword(req.body.password);

  user.save((err) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.redirect('/')
    }
  });
};

module.exports.validateUser = (req, res) => {
  console.log(req.body);
  passport.authenticate('local', (err, user) => {
    if (err) {
      next(err);
    }

    if (!user) {
      console.log('no user');
      res.status(402).json({ message: err });
      return;
    }
    req.logIn(user, (err2) => {
      if (err2) { next(err); }
      if (req.body.lengthOfStay) {
        res.redirect(307, '/locations/'.concat(req.body.lengthOfStay)); // show vacancies
      }
      res.redirect('/admin');
    });
  })(req, res, next);
};
}