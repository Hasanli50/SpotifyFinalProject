const express = require("express");
const passport = require("passport");
const router = express.Router();
require("dotenv").config();

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/artist/login",
    session: true, 
  }),
  (req, res) => {
    res.redirect(`${process.env.APP_BASE_URL}/artist`);
  }
);

module.exports = router;
