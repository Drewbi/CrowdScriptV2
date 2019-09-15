const express = require("express");
const { getLowestEpisode } = require("../controllers/episode");
const { getSegment } = require("../controllers/segment");
const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res) => {
  if (!req.user) res.redirect("/about");
  else {
    const [episode] = await getLowestEpisode();
    let segment = null;
    if(episode) segment = await getSegment(episode._id, 0);
    console.log(episode);
    res.render("transcript", {
      title: "Transcripter",
      episode: episode,
      segment: segment
    });
  }
});

router.post("/", (req, res) => {
  // if (req.user) res.redirect("/");
});

module.exports = router;
