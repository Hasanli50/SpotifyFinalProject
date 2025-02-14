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
require("./src/config/userPassport.js")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_BASE_URL || "http://localhost:5173", 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/auth", artistAuthRoutes);
app.use("/auth-user", userAuthRoutes);
app.use("/users", userRouter);
app.use("/artists", artistRouter);
app.use("/playlists", playlistRouter);
app.use("/genres", genreRoutes);
app.use("/tracks", trackRouter);
app.use("/albums", albumRouter);
app.use("/search", searchRouter);

app.use(multerErrorHandling);

app.get("/", (req, res) => {
  res.render("index");
});

connectToDb();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
