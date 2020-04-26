const express = require('express')

require('./_utils/mongoose')

const router = require('./_routes/auth')

const app = express()
app.use(router)

module.exports = app
