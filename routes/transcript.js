const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  if (!req.user) res.redirect("/about");
  else res.render("transcript", {
    title: "Transcripter",
    episodeName: "Episode 230: Words about words",
    placeholderText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  });
});

router.post("/", (req, res) => {
  if (req.user) res.redirect("/");
});

module.exports = router;
