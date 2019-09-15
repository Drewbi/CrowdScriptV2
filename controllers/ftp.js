const PromiseFTP = require("promise-ftp");
const fs = require("fs");
const path = require("path");

module.exports.uploadSegments = (episodeNum, numSegments) => {
  return new Promise((resolve, reject) => {
    console.log("Uploading segments");
    const directory = `${process.env.PWD}/public/exports/${episodeNum}`;
    const ftpDirectory = `segments/${episodeNum}`;
    const ftp = new PromiseFTP();
    const config = {
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      host: process.env.FTP_HOST
    };
    ftp.connect(config)
      .then(() => {
        return ftp.mkdir(ftpDirectory);
      })
      .then(() => {
        let promises = [];
        for (let i = 1; i <= numSegments; i++) {
          const fileName = `${episodeNum}-${i}.mp3`;
          const promise = ftp.put(
            `${directory}/${fileName}`,
            `${ftpDirectory}/${fileName}`
          );
          promises.push(promise);
        }
        return promises;
      })
      .then(() => {
        return ftp.end();
      })
      .then(() => {
        fs.readdir(directory, (err, files) => {
          if (err) reject(err);
          for (const file of files) {
            fs.unlinkSync(path.join(directory, file));
          }
          fs.rmdirSync(directory);
        });
        console.log("Upload successful");
        resolve();
      });
  });
};
