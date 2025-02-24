const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_USER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_USER,
      callbackURL: "https://spotifyfinalproject-6.onrender.com/api/auth-user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            password: "google-login",
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            isVerified: true,
          });
        } else if (!user.isVerified) {
          user.isVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
