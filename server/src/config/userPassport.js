const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); 
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_USER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_USER,
      callbackURL: "/auth-user/google/callback",
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
          });
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
