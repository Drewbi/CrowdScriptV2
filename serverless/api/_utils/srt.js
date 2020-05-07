const parser = require('subtitles-parser')
const fs = require('fs')

const getSegmentsFromSRT = (file, episodeId) => {
  const data = parseSRT(file)
  return data.map(srtSegment => {
    const { id: number, startTime, endTime, text } = srtSegment
    return { number, time: { in: startTime, out: endTime }, text, episode: episodeId }
  })
}

const parseSRT = (file) => {
  let data = fs.readFileSync(file.path, 'utf8')
  data = data.replace(/(\d{2}:\d{2}:\d{2},\d{2})(\s)/g, '$10$2')
  return parser.fromSrt(data, true)
}

module.exports = { getSegmentsFromSRT }
