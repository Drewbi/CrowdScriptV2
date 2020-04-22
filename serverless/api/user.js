const express = require('express')
require('./_utils/mongoose')
require('./_models/user')
require('./_models/session')
require('./_models/submission')
const router = require('./_routes/user')

const app = express()
app.use(router)

module.exports = app
