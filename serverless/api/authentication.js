const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('./_utils/mongoose')

const router = require('./_routes/auth')

const app = express()
app.use(cookieParser())

const corsOptions = {
  origin: true,
  credentials: true
}
app.use(cors(corsOptions))
app.use(router)

module.exports = app
