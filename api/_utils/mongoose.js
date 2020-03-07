const mongoose = require('mongoose');

let mongoURI = process.env.DEV_MONGODB_URI;
if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGODB_URI;
}

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(mongoURI);

module.exports = mongoose;
