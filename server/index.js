const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const connectToDb = require("./src/config/db.js");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectToDb();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});