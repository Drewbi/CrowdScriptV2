const FTP = require("ftp");
const FtpDeploy = require("ftp-deploy");
const fs = require("fs");
const path = require('path');

module.exports.ftpUpload = (path, name) => {
  const ftp = new FTP();
  ftp.on("ready", () => {
    ftp.put(path, `segments/${name}`, err => {
      if (err) console.log(err);
      ftp.end();
    });
  });  
  ftp.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });
};

module.exports.uploadSegments = () => {
  return new Promise((resolve, reject) => {
    console.log("Uploading segments");
    const directory = process.env.PWD + "/public/exports";
    const ftpDeploy = new FtpDeploy();
    const config = {
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      host: process.env.FTP_HOST,
      port: 21,
      localRoot: directory,
      remoteRoot: "/segments",
      include: ["*.mp3"]
    };
    ftpDeploy.deploy(config, (err, res) => {
      console.log("Segments uploaded");
      if (err) reject(err);
      else {
        fs.readdir(directory, (err, files) => {
          if (err) reject(err);
          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) reject(err);
            });
          }
        });
        resolve(res)
      };
    });
  });
};
