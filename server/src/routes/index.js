const Router = require("express").Router();

// Router v1
const v1 = require("./v1");
Router.use("/v1", v1);

// Not Path
Router.use((req, res, next) => {
  const err = new Error("Not Path");
  err.status = 404;
  next(err);
});

module.exports = Router;
