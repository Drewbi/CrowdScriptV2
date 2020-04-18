const express = require('express')
const app = express()
app.get('*', (req, res) => {
  res.json('hello')
})

export default (req, res) => {
  app(req, res)
}