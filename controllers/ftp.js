const FTP = require("ftp");

module.exports.ftpUpload = fileName => {
  const ftp = new FTP();
  ftp.on("ready", () => {
    ftp.put(`public/episodes/${fileName}`, `segments/${fileName}`, err => {
      if (err) console.log(err);
      ftp.end();
      console.log("FTP Transfer Successful");
    });
  });
  ftp.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });
};
