const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submissions");
const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  const [users, submissions] = await Promise.all([
    getAllUsers(),
    getSubmissions()
  ]);
  console.log(users);

  res.render("admin", { title: "Admin", submissions, users });
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
