const parser = require('subtitles-parser');
const fs = require("fs");

module.exports.parseSRT = (srtFile) => {
  let data = fs.readFileSync(srtFile.path,'utf8');
  data = data.replace(/(\d{2}:\d{2}:\d{2},\d{2})(\s)/g, '$10$2');
  return parser.fromSrt(data, true);
}