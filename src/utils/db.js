const mongoose = require("mongoose");

const dbConnector = (cb) => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log("DB Connected");
      cb();
    });
};

module.exports = dbConnector;
