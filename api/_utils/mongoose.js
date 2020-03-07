const mongoose = require("mongoose");

if (process.env.NODE_ENV === "production") {
  mongoURI = process.env.MONGODB_URI;
} else {
  mongoURI = process.env.DEV_MONGODB_URI;
}

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect(mongoURI);
console.log("Database connected to: " + mongoURI)

module.exports = mongoose