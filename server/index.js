const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const connectToDb = require("./src/config/db.js");
const cors = require("cors");
const path = require("path");
const artistAuthRoutes = require("./src/routes/artistAuthRoutes.js");
const userAuthRoutes = require("./src/routes/userAuthRoutes.js");
const userRouter = require("./src/routes/userRouter.js");
const artistRouter = require("./src/routes/artistRouter.js");
const playlistRouter = require("./src/routes/playlistRouter.js");
const trackRouter = require("./src/routes/trackRouter.js");
const genreRoutes = require("./src/routes/genreRouter.js");
const albumRouter = require("./src/routes/albumRouter.js");
const searchRouter = require("./src/routes/searchRouter.js");
const multerErrorHandling = require("./src/middlewares/multerErrorHendling.js");
const passport = require("passport");
const session = require("express-session");
require("./src/config/artistPassport.js");
require("./src/config/userPassport.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.APP_BASE_URL ||
      "https://spotify-final-project-three.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth-artist", artistAuthRoutes);
app.use("/api/auth-user", userAuthRoutes);
app.use("/api/users", userRouter);
app.use("/api/artists", artistRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/genres", genreRoutes);
app.use("/api/tracks", trackRouter);
app.use("/api/albums", albumRouter);
app.use("/api/search", searchRouter);

app.use(multerErrorHandling);

app.get("/", (req, res) => {
  res.render("index");
});

connectToDb();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
