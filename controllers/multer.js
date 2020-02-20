const multer = require("multer");
const fs = require("fs");
// Multer storage setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const createFolder = (path) => {
  if(!fs.existsSync(path)){
    fs.mkdirSync(path)
  }
}

module.exports = { upload, createFolder };
