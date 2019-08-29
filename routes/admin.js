const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submissions");
const upload = require("../controllers/multer");
const { ftpUpload } = require("../controllers/ftp");
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

/* POST audio and transcript */
router.post(
  "/",
  upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "srtFile", maxCount: 1 }
  ]),
  (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    console.log(files);
    const { audioFile } = files;
    const { srtFile } = files;
    [audioFile, srtFile].forEach(file => {
      let extention = "";
      if (file.mimetype === "audio/mp3") {
        extention = ".mp3";
      } else {
        extention = ".srt";
      }
      const fileName = `public/episodes/${file.fieldname +
        req.body.episodeNum +
        extention}`;
      fs.rename(file.path, fileName, err => {
        if (err) {
          console.log(err);
        }
      });
      ftpUpload(fileName);
    });

    res.redirect("/admin");
  }
);

module.exports = router;
