const express = require("express");
const { getLowestEpisodes, getEpisodeById } = require("../controllers/episode");
const { getSegmentBySlug, getNextSegment, getSegmentById, updateSegment} = require("../controllers/segment");
const { createSubmission } = require("../controllers/submission");
const { createSession, getSessionByUser, discardSession, checkSegment } = require("../controllers/session");
const router = express.Router();

router.get("/:segmentId([A-F0-9]{10})", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const [segment] = await getSegmentBySlug(req.params.segmentId);
  if(!segment) return res.redirect("/");
  const [episode] = await getEpisodeById(segment.episode);
  res.render("transcript", {
    title: "Transcripter",
    episode: episode,
    segment: segment
  });
});
/* get transcript page. */
router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/about");
  const [session] = await getSessionByUser(req.user._id);
  if(session) {
    const [segment] = await getSegmentById(session.segment);
    const segmentFree = await checkSegment(segment);
    if(!segmentFree) return res.redirect("/" + segment.slug);
  }
  const episodes = await getLowestEpisodes();
  const segmentPromises = [];
  episodes.forEach((episode) => {
    const promise = getNextSegment(episode, episode.passCompleted + 1);
    segmentPromises.push(promise);
  });
  const segments = await Promise.all(segmentPromises);
  const [validSegment] = segments.filter((segment) => !!segment)
  if(validSegment){
    createSession(req, validSegment);
    return res.redirect("/" + validSegment.slug);
  }
  // No segments found that need completing
  return res.render("completed");
});


router.post("/:segmentId([A-F0-9]{10})", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const [segment] = await getSegmentBySlug(req.params.segmentId);
  const submission = await createSubmission(req, segment._id, segment.passes + 1);
  await updateSegment(segment._id, segment.passes + 1, submission)
  await discardSession(req.user._id);
  res.redirect('/');
});

module.exports = router;
