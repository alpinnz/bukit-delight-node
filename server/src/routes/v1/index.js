const Router = require("express").Router();

const authentication = require("./authentication");
Router.use("/authentication", authentication);

module.exports = Router;
