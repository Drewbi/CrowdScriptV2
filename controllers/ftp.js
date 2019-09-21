const PromiseFTP = require("promise-ftp");
const fs = require("fs");
const path = require("path");

module.exports.uploadSegments = (episodeNum, numSegments) => {
  return new Promise(async (resolve, reject) => {
    console.log("Uploading segments");
    const directory = `${process.env.PWD}/public/exports/${episodeNum}`;
    const ftpDirectory = `segments/${episodeNum}`;
    const ftp = new PromiseFTP();
    const config = {
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      host: process.env.FTP_HOST
    };
    await ftp.connect(config);
    await ftp.mkdir(ftpDirectory);
    const tasks = Array(numSegments).fill(null).map((_, index) => {
      const fileName = `${episodeNum}-${index+1}.mp3`;
      const promise = ftp.put( 
        `${directory}/${fileName}`,
        `${ftpDirectory}/${fileName}`);
      return promise;
    });
    await Promise.all(tasks);
    console.log("Segments uploaded");
    ftp.end();
    fs.readdir(directory, (err, files) => {
      if (err) reject(err);
      for (const file of files) {
        fs.unlinkSync(path.join(directory, file));
      }
      fs.rmdirSync(directory);
    });
    resolve();
  });
};
