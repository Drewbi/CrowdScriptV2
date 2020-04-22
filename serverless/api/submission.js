const express = require('express')

require('./_utils/mongoose')
require('./_models/submission')
require('./_models/segment')
require('./_models/session')
require('./_models/episode')
const router = require('./_routes/submission')

const app = express()
app.use(router)

module.exports = app
