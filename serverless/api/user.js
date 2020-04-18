const express = require('express')
require('./_utils/mongoose')
require('./_models/user')
const router = require('./_routes/user')

const app = express()
app.use(router)

module.exports = app
