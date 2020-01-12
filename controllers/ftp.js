const PromiseFTP = require("promise-ftp");
const fs = require("fs");
const path = require("path");
const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  host: process.env.FTP_HOST
};

const uploadSegments = (episodeNum, numSegments) => {
  return new Promise(async (resolve, reject) => {
    console.log("Uploading segments");
    const directory = `${process.env.PWD}/public/exports/${episodeNum}`;
    const ftpDirectory = `segments/${episodeNum}`;
    const ftp = new PromiseFTP();
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

const uploadEpisode = async (epNum, filePath) => {
  return new Promise(async (resolve, reject) => {
    console.log("Uploading episode");
    const ftp = new PromiseFTP();
    await ftp.connect(config);
    const ftpDirectory = 'episodes';
    const fileName = `${epNum}.mp3`;
    ftp.put(filePath, `${ftpDirectory}/${fileName}`).catch(err => {
      reject(err)
    }).then(res => {
      ftp.end();
      resolve(res)
    })
  })
}

const downloadEpisode = (episodeNum) => {
  return new Promise(async (resolve, reject) => {
    const ftpFilePath = `episodes/${episodeNum}.mp3`;
    const filePath = `/audio/${episodeNum}.mp3`
    const localFilePath = `${process.env.PWD}/public/audio/${episodeNum}.mp3`;
    if(!episodeDownloaded(episodeNum)){
      const ftp = new PromiseFTP();
      await ftp.connect(config);
      const stream = await ftp.get(ftpFilePath);
      const streamDownload = new Promise((resolve, reject) => {
        stream.once("close", resolve);
        stream.once('error', reject);
        stream.pipe(fs.createWriteStream(localFilePath));
      })
      await streamDownload.catch(reject);
      ftp.end();
    }
    resolve(filePath)
  });
};

const downloadNextSegments = (episode, currentSegment, downloadNumber) => {
  const numSegments = episode.segment.length;
  let segmentNum = currentSegment + 1;
  let segmentPromises = [];
  let numDownloaded = 0;
  while(segmentNum <= numSegments && numDownloaded < downloadNumber){
    segmentPromises.push(downloadSegment(episode.number, segmentNum));
    numDownloaded++;
    segmentNum++;
  }
  if(numDownloaded !== downloadNumber){
    segmentPromises.push(downloadSegment(episode.number + 1, 1));
  }
  Promise.all(segmentPromises);
}

const episodeDownloaded = (episodeNum) => {
  const localFilePath = `${process.env.PWD}/public/audio/${episodeNum}.mp3`;
  return fs.existsSync(localFilePath);
}

const downloadSegment = (episodeNum,  segmentNum) => {
  return new Promise(async (resolve, reject) => {
    const ftpFilePath = `segments/${episodeNum}/${episodeNum}-${segmentNum}.mp3`;
    const filePath = `/audio/${episodeNum}-${segmentNum}.mp3`
    const localFilePath = `${process.env.PWD}/public/audio/${episodeNum}-${segmentNum}.mp3`;
    if(!segmentDownloaded(episodeNum, segmentNum)){
      const ftp = new PromiseFTP();
      await ftp.connect(config);
      const stream = await ftp.get(ftpFilePath);
      const streamDownload = new Promise((resolve, reject) => {
        stream.once("close", resolve);
        stream.once('error', reject);
        stream.pipe(fs.createWriteStream(localFilePath));
      })
      await streamDownload.catch(reject);
      ftp.end();
    }
    resolve(filePath)
  });
};

const segmentDownloaded = (episodeNum, segmentNum) => {
  const localFilePath = `${process.env.PWD}/public/audio/${episodeNum}-${segmentNum}.mp3`;
  return fs.existsSync(localFilePath);
}

const removeDownloaded = (episodeNum, segmentNum) => {
  const localFilePath = `${process.env.PWD}/public/audio/${episodeNum}-${segmentNum}.mp3`;
  fs.unlinkSync(localFilePath);
}

module.exports = {
  uploadSegments,
  uploadEpisode,
  downloadEpisode,
  downloadNextSegments,
  episodeDownloaded,
  downloadSegment,
  segmentDownloaded,
  removeDownloaded
}