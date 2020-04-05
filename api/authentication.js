const express = require('express')

require('./_utils/mongoose')
require('./_models/user')
require('./_models/session')
const router = require('./_routes/auth')

const app = express()
app.use(router)

module.exports = app
