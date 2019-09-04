const express = require("express");
const { logoutUser } = require("../controllers/users");
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    logoutUser(req, res);
  }
});

module.exports = router;