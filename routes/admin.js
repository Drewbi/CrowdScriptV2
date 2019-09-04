const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submissions");
const { addEpisode, getEpisodes } = require("../controllers/episode");
const upload = require("../controllers/multer");
const { ftpUpload } = require("../controllers/ftp");
const fs = require("fs");
const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else if (!req.user.admin) {
    res.redirect("/");
  } else {
    const [users, submissions, episodes] = await Promise.all([
      getAllUsers(),
      getSubmissions(),
      getEpisodes()
    ]);
    res.render("admin", { title: "Admin", submissions, users, episodes });
  }
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
    if (Object.entries(files).length === 0) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    const episodePath = "public/episodes/";
    // Audio file processing
    const [audioFile] = files.audioFile;
    const audioFileName = `${audioFile.fieldname + req.body.episodeNum}.mp3`;
    fs.rename(audioFile.path, episodePath + audioFileName, err => {
      if (err) {
        console.log(err);
      }
    });
    ftpUpload(audioFileName);
    // SRT file processing
    const [srtFile] = files.srtFile;
    const srtFileName = `${srtFile.fieldname + req.body.episodeNum}.srt`;
    fs.rename(srtFile.path, episodePath + srtFileName, err => {
      if (err) {
        console.log(err);
      }
    });
    ftpUpload(srtFileName);
    addEpisode(req, res);
  }
);

module.exports = router;
