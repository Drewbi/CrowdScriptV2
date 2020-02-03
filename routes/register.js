const express = require("express");
const { addUser } = require("../controllers/users");
const router = express.Router();

/* GET register page. */
router.get("/", (req, res) => {
  if (req.user) res.redirect("/");
  else res.render("register", {
    title: "Register",
    user: req.user
  });
});

router.post("/", (req, res) => {
  addUser(req, res);
});

module.exports = router;
