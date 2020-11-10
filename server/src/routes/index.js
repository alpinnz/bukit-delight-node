const Router = require("express").Router();

// Router v1
const v1 = require("./v1");
Router.use("/v1", v1);

module.exports = Router;
