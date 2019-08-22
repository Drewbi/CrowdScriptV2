const FTP = require("ftp");

module.exports.ftpUpload = fileName => {
  const ftp = new FTP();
  ftp.on("ready", () => {
    ftp.put(fileName, `segments/${fileName}`, err => {
      if (err) throw err;
      ftp.end();
    });
  });
  ftp.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });
};
