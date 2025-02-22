const express = require("express");
const passport = require("passport");
const router = express.Router();
require("dotenv").config();

// Google Auth Route for artist
router.get(
  "/google",
  passport.authenticate("artist-google", { scope: ["profile", "email"] })
);

// Google Auth Callback Route for artist
router.get(
  "/google/callback",
  passport.authenticate("artist-google", {
    failureRedirect: "/artist/login",
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    req.artist = req.user;

    const token = req.artist.generateToken();
    res.redirect(`${process.env.APP_BASE_URL}/artist/login?token=${token}`);
  }
);

module.exports = router;
