const mongoose = require("mongoose");
const passport = require("passport");

const User = mongoose.model("User");

module.exports.addUser = (req, res) => {
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.credit = !!req.body.credit;
  user.setPassword(req.body.password);
  user.save(err => {
    if (err) {
      console.error(`Error registering user: ${err}`);
      if(err.code === 11000) res.flash('error', 'Email already registered');
      else res.flash('error', 'Error signing in');
      res.redirect("/register");
    } else {
      req.login(user, function(err) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    }
  });
};

module.exports.validateUser = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.flash('error', 'Invalid credentials');
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      if (user.admin) {
        return res.redirect("/admin");
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

module.exports.getAllUsers = () => {
  return User.find({}, "name email");
};

module.exports.userWantsCredit = (id) => {
  return User.findOne({_id: id}, 'credit')
}

module.exports.getUser = (id) => {
  return User.findOne({_id: id}, 'name')
}