const express = require("express");
const passport = require("passport");
const router = express.Router();
require("dotenv").config();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateToken();

    res.redirect(`${process.env.APP_BASE_URL}/login?token=${token}`);
  }
);

module.exports = router;
