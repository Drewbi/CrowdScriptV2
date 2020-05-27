const parser = require('subtitles-parser')
const axios = require('axios')

const getSegmentsFromSRT = async (link, episodeId) => {
  const data = await parseSRT(link)
  return data.map(srtSegment => {
    const { id: number, startTime, endTime, text } = srtSegment
    return { number, time: { start: startTime, end: endTime }, text, episode: episodeId }
  })
}

const parseSRT = async (link) => {
  const { data } = await axios.get(link)
  const formattedData = data.replace(/(\d{2}:\d{2}:\d{2},\d{2})(\s)/g, '$10$2')
  return parser.fromSrt(formattedData, true)
}
module.exports = { getSegmentsFromSRT }
