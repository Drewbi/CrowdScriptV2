const express = require("express");
const { validateUser } = require("../controllers/users");
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  res.render("login", {
    title: "Login"
  });
});

router.post("/", (req, res) => {
  validateUser(req, res);
});

module.exports = router;
