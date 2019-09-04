const mongoose = require("mongoose");

const Episode = mongoose.model("Episode");

module.exports.getEpisodes = () => {
  return Episode.find({})
};

module.exports.addEpisode = (req, res) => {
  const episode = new Episode();
  episode.name = req.body.episodeName;
  episode.number = req.body.episodeNum;
  episode.complted = false;
  episode.save(err => {
    if (err) {
      console.error(`Error adding episode: ${err}`);
      res.redirect("/admin");
    } else {
      res.redirect("/admin");
    }
  });
};
