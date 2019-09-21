const express = require("express");
const { getLowestEpisode, getEpisodeById } = require("../controllers/episode");
const { getSegment, getSegmentBySlug } = require("../controllers/segment");
const router = express.Router();

router.get("/:segmentId([A-F0-9]{10})", async (req, res) => {
  if (!req.user) res.redirect("/login");
  else {
    const [segment] = await getSegmentBySlug(req.params.segmentId);
    console.log(segment);
    const [episode] = await getEpisodeById(segment.episode);
    console.log(episode);
    res.render("transcript", {
      title: "Transcripter",
      episode: episode,
      segment: segment
    });
  }
});
/* GET users listing. */
router.get("/", async (req, res) => {
  if (!req.user) res.redirect("/about");
  else {
    const [episode] = await getLowestEpisode();
    console.log(episode);
    console.log("Epsiode found");
    const [segment] = await getSegment(episode._id, 0);
    console.log(segment);
    if(segment) return res.redirect("/" + segment.slug);
    else res.render("404");
  }
});

router.post("/", (req, res) => {
  // if (req.user) res.redirect("/");
});

module.exports = router;
