const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes");
const Response = require("./middlewares/Response");
//
require("dotenv").config();
require("./config/Mongoose").connect();

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", indexRouter);

// error handler middleware
app.use(Response.Error);

module.exports = app;
