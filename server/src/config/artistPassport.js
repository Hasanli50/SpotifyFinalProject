const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Artist = require("../models/artist"); 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
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
          });
        }

        return done(null, artist); 
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((artist, done) => { 
  done(null, artist.id);
});

passport.deserializeUser(async (id, done) => { 
  try {
    const artist = await Artist.findById(id);
    done(null, artist);
  } catch (error) {
    done(error, null);
  }
});
