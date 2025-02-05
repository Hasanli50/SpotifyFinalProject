const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:6060/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});






// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/user');  // Your User model

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: 'http://localhost:6060/auth/google/callback',  // Replace with your URL
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     // Find or create the user in your database based on the Google profile
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//       user = await User.create({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//         displayName: profile.displayName,
//       });
//     }

//     return done(null, user);  // Pass the user object to the session
//   } catch (error) {
//     return done(error, null);
//   }
// }));

// // Serialize and deserialize the user to maintain the session
// passport.serializeUser((user, done) => {
//   done(null, user.id);  // Store user ID in the session
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);  // Fetch user by ID
//   done(null, user);
// });
