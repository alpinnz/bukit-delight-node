require("dotenv").config();
const logger = require("morgan");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const indexRouter = require("./routes");
const { Response } = require("./middlewares");
const { Mongoose } = require("./config");

const app = express();
Mongoose.connect();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "./../public")));
app.use("/", indexRouter);
// Not Path
// app.use("*", (req, res, next) => {
//   const err = new Error("Not Path");
//   err.status = 404;
//   next(err);
// });

// error handler middleware
app.use(Response.Error);

module.exports = app;
