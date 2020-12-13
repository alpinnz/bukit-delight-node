const Router = require("express").Router();
const Roles = require("./../../controllers/Roles");

/* GET Account page. */
Router.get("/", Roles.ReadAll);

module.exports = Router;
