const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// connect app to mongodb
mongoose.connect(
  "mongodb://localhost/altmagz",
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => {
    err ? console.log('Not connected to DB') : console.log('Connected to DB');
  }
);

require('dotenv').config();

// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/api/users");
const profileRouter = require('./routes/api/profiles');
const articleRouter = require('./routes/api/articles');

// initializing express in app
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



// routes

app.use("/", indexRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/profiles',profileRouter);
app.use("/api/v1/articles", articleRouter);

module.exports = app;
