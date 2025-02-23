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
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateToken();

    res.redirect(`http://localhost:5174/login?token=${token}`);
  }
);


module.exports = router;
