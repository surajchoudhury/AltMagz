const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


require("./modules/passport");


// connect app to mongodb
mongoose.connect(
  "mongodb://localhost/altmagz",
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => {
    err ? console.log("Not connected to DB") : console.log("Connected to DB");
  }
);

require("dotenv").config();

// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profiles");
const articleRouter = require("./routes/api/articles");

// initializing express in app
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: "thisissecret",
    saveUninitialized: "false",
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// passport

app.use(passport.initialize());
app.use(passport.session());

// routes

app.use("/", indexRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/articles", articleRouter);

module.exports = app;
