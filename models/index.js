const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoURI = `${config.dialect}://${config.username}:${process.env.DB_PASS}@${config.host}:${config.port}/${config.database}`;
mongoose.connect(mongoURI, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



module.exports = db;
