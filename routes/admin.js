const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submissions");
const upload = require("../controllers/multer");
const fs = require("fs");
const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  const [users, submissions] = await Promise.all([
    getAllUsers(),
    getSubmissions()
  ]);
  res.render("admin", { title: "Admin", submissions, users });
});

router.post("/", upload.single("episodeAudio"), (req, res, next) => {
  console.log(req.body.episodeNum);
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    fs.rename(
      `public/uploads/${file.originalname}`,
      `public/uploads/${file.fieldname + req.body.episodeNum}.mp3`,
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  // uploadFile(req.file);
  res.redirect("/admin");
});

module.exports = router;
