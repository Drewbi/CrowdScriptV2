const express = require("express");
const multer = require("multer");
const upload = multer();
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

router.post("/", upload.single("episodeAudio"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
