const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('./_utils/mongoose')

const router = require('./_routes/submission')

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(router)

module.exports = app
