const FTP = require("ftp");

module.exports.uploadFile = file => {
  const ftp = new FTP();
  ftp.on("ready", function() {
    console.log(file);

    //   ftp.put(res.file, "Test", function(err) {
    //     if (err) throw err;
    //     ftp.end();
    //   });
  });
  ftp.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });
};
