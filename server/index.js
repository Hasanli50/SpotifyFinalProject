const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const connectToDb = require("./src/config/db.js");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes.js");
const userRouter = require("./src/routes/userRouter.js");
const artistRouter = require("./src/routes/artistRouter.js");
const genreRoutes = require("./src/routes/genreRouter.js")
const multerErrorHandling = require("./src/middlewares/multerErrorHendling.js");
const passport = require("passport"); 
const session = require("express-session");
require("./src/config/passport.js");  

// Set up the view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", userRouter);
app.use("/artists", artistRouter )
app.use("/genres", genreRoutes )

app.use(multerErrorHandling);

app.get("/", (req, res) => {
  res.render('index');
});

connectToDb();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
