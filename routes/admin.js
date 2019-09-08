const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submissions");
const { addEpisode, getEpisodes } = require("../controllers/episode");
const upload = require("../controllers/multer");
const { ftpUpload } = require("../controllers/ftp");
const parser = require('subtitles-parser');
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
    if (!req.user) res.redirect('/login');
    else {
      const files = req.files;
      if (Object.entries(files).length === 0) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
      }
      const episodePath = "public/episodes/";
      // SRT file processing
      const [srtFile] = files.srtFile;
      let data = fs.readFileSync(srtFile.path,'utf8');
      data = data.replace(/(\d{2}:\d{2}:\d{2},\d{2})(\s)/g, '$10$2');
      const srt = parser.fromSrt(data, true);
      console.log(srt);
      // Audio file processing
      const [audioFile] = files.audioFile;
      const audioFileName = `${audioFile.fieldname + req.body.episodeNum}.mp3`;
      fs.rename(audioFile.path, episodePath + audioFileName, err => {
        if (err) {
          console.log(err);
        }
      });
      // ftpUpload(audioFileName);
      addEpisode(req, res);
    }
  }
);

module.exports = router;
