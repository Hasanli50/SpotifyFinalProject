const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_DB = process.env.MONGO_DB;

const connectToDb = () => {
  mongoose
    .connect(MONGO_DB)
    .then(() => {
      console.log("Connect to db");
    })
    .catch((error) => {
      console.log("Failed in connect to db", error);
    });
};

module.exports = connectToDb;
