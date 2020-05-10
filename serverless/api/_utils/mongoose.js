const mongoose = require('mongoose')
const mongoURI = process.env.MONGODB_URI

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(mongoURI)

require('../_models/session')
require('../_models/user')
require('../_models/segment')
require('../_models/episode')
require('../_models/submission')

module.exports = mongoose
