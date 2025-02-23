const { search } = require("../controllers/searchController.js");
const express = require("express");
const router = express.Router();

router.get("/", search);

module.exports = router;
