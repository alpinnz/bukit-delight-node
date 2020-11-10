const Router = require("express").Router();
const { Authentication } = require("./../../middlewares");

Router.get("/", Authentication.checkAccessToken, (req, res, next) => {
  res.json({ index: "index" });
});

const authentication = require("./authentication");
Router.use("/authentication", authentication);

module.exports = Router;
