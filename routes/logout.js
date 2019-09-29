const express = require("express");
const { discardSession } = require("../controllers/session");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  discardSession(req.user._id)
  req.logout();
  return res.redirect('/login');
});

module.exports = router;