const express = require("express");
const { getAllUsers, getUser } = require("../controllers/users");
const { addEpisode, getEpisodes, getEpisodeByNum } = require("../controllers/episode");
const { generateSegments, getSubmissionsFromEpisode } = require("../controllers/segment");
const { upload } = require("../controllers/multer");
const { uploadSegments, uploadEpisode, downloadEpisode } = require("../controllers/ftp");
const { parseSRT } = require("../controllers/srt");
const fs = require("fs");
const router = express.Router();

/* Get admin page */
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  } else if (!req.user.admin) {
    return res.redirect("/");
  }
  const [users, episodes] = await Promise.all([
    getAllUsers(),
    getEpisodes()
  ]);

  const episodePromises = episodes.map(async (episode) => {
    const submissions = await getSubmissionsFromEpisode(episode._id)
    return { episode, submissions: [ submissions ] }
  })
  const episodeData = await Promise.all(episodePromises)
  res.render("admin", {
    title: "Admin",
    episodeData, 
    users,
    user: req.user
  });
});

router.get('/:epNum', async (req, res) => {
  // if (!req.user) {
  //   return res.redirect("/login");
  // } else if (!req.user.admin) {
  //   return res.redirect("/");
  // }
  const [ episode ] = await getEpisodeByNum(req.params.epNum)
  const submissions = await getSubmissionsFromEpisode(episode._id)
  const submissionText = submissions.reduce((acc, [ curr ]) => {
    return acc + ' ' + curr.text
  }, '')
  const userArray = []
  submissions.forEach(([submission]) => {
    if (!userArray.includes(String(submission.user))) {
      userArray.push(String(submission.user))
    }
  })
  const userSubmissionNumberPromises = userArray.map(async user => {
    const userName = await getUser(user)
    const numSubmissions = submissions.reduce((accumulator, [submission]) => {
      if(String(submission.user) === user) return accumulator + 1
      else return accumulator + 0
    }, 0)
    return {
        name: userName.name,
        submissions: numSubmissions,
        credit: userName.credit
      }
    })
  const userSubmissionNumbers = await Promise.all(userSubmissionNumberPromises)
  const audioPath = await downloadEpisode(req.params.epNum)
  res.render("episode", { 
    title: "Episode " + req.params.epNum, 
    episode: episode,
    userSubmissionNumbers,
    submissionText, 
    audio: audioPath,
    user: req.user
  });
})

/* POST audio and transcript */
router.post(
  "/",
  upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "srtFile", maxCount: 1 }
  ]),
  async (req, res, next) => {
    if (!req.user) return res.redirect('/login');
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
    if(!!req.body.upload) {
      await uploadSegments(episode.number, segmentList.length);
      await uploadEpisode(episode.number, audioFile.path)
    }
    // Remove uploaded files
    console.log("Unlinking uploaded files");
    fs.unlinkSync(audioFile.path);
    fs.unlinkSync(srtFile.path);
  }
);

module.exports = router;
