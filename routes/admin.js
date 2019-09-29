const express = require("express");
const { getAllUsers } = require("../controllers/users");
const { getSubmissions } = require("../controllers/submission");
const { addEpisode, getEpisodes } = require("../controllers/episode");
const { generateSegments } = require("../controllers/segment");
const upload = require("../controllers/multer");
const { uploadSegments } = require("../controllers/ftp");
const { parseSRT } = require("../controllers/srt");
const fs = require("fs");
const router = express.Router();

/* Get admin page */
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
  async (req, res, next) => {
    if (!req.user) res.redirect('/login');
    else {
      const files = req.files;

      // Double check for both files
      if (Object.entries(files).length !== 2) {
        res.flash("Please upload both files");
        return res.redirect('/admin');
      } else {
        res.flash('Processing files');
        res.redirect('/admin')
      }

      // SRT file processing
      const [srtFile] = files.srtFile;
      const srt = parseSRT(srtFile);
      
      // Audio file processing
      const [audioFile] = files.audioFile;
      const episode = await addEpisode(req);
      const segmentList = await generateSegments(srt, episode, audioFile.path)
      console.log("Updating episode with segments");
      // Updating episode with segment ids
      episode.segment = segmentList;
      episode.save();

      // Upload segments to ftp server
      await uploadSegments(episode.number, segmentList.length);
      console.log("Unlinking uploaded files");

      // Remove uploaded files
      fs.unlinkSync(audioFile.path);
      fs.unlinkSync(srtFile.path);
      
    }
  }
);

module.exports = router;
