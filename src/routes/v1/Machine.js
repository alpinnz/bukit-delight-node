const Router = require("express").Router();
const Machine = require("./../../controllers/Machine");

/* GET Account page. */
Router.get("/favorite", Machine.Favorite);

module.exports = Router;
