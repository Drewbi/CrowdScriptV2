const mongoose = require('mongoose')
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.DEV_MONGODB_URI

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(mongoURI)

module.exports = mongoose
