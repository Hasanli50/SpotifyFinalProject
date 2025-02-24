const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Artist = require("../models/artist");
require("dotenv").config();

passport.use(
  "artist-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://spotifyfinalproject-6.onrender.com/api/auth-artist/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let artist = await Artist.findOne({ email: profile.emails[0].value });

        if (!artist) {
          artist = await Artist.create({
            googleId: profile.id,
            username: profile.displayName,
            password: "google-login",
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            status: "approved",
          });
        } else if (artist.status === "pending") {
          artist.status = "approved";
          await artist.save();
        }

        return done(null, artist);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((artist, done) => {
  done(null, artist._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const artist = await Artist.findById(id);
    done(null, artist);
  } catch (error) {
    done(error, null);
  }
});
