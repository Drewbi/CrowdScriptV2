const mongoose = require("mongoose");

if (process.env.NODE_ENV === "production") {
  mongoURI = process.env.MONGODB_URI;
} else {
  mongoURI = process.env.DEV_MONGODB_URI;
}

mongoose.set("useCreateIndex", true);
mongoose.connect(mongoURI, { useNewUrlParser: true });

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${mongoURI}`);
});

mongoose.connection.on("error", err => {
  console.log(`Mongoose connection error ${err}`);
});

mongoose.connection.on("disconected", () => {
  console.log("Mongoose disconnected");
});

require("./user");
require("./episode");
require("./segment");
require("./session");
require("./submission");
