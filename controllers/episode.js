const mongoose = require("mongoose");

const Episode = mongoose.model("Episode");

module.exports.getEpisodes = () => {
  return Episode.find();
};

module.exports.getEpisodeById = (episodeId) => {
  return Episode.find({ _id: episodeId });
};

module.exports.getEpisodeByNum = (episodeNum) => {
  return Episode.find({ number: episodeNum });
};

module.exports.getLowestEpisodes = () => {
  return Episode.find({ completed: false }).sort( { number: -1 } ).limit(2);
};

module.exports.addEpisode = (req) => {
  return new Promise((resolve, reject) => {
    const episode = new Episode();
    episode.name = req.body.episodeName;
    episode.number = req.body.episodeNum;
    episode.completed = false;
    episode.save(err => {
      if (err) {
        reject(err);
      }
    });
    console.log("Finished episode creation");
    resolve(episode);
  });
};
