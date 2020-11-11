const Router = require("express").Router();
const { Authentication } = require("./../../middlewares");

Router.get("/", Authentication.checkAccessToken, (req, res, next) => {
  res.json({ index: "index" });
});

const authentication = require("./authentication");
Router.use("/authentication", authentication);

const accounts = require("./accounts");
Router.use("/accounts", accounts);

const categories = require("./categories");
Router.use("/categories", categories);

const menus = require("./menus");
Router.use("/menus", menus);

const tables = require("./tables");
Router.use("/tables", tables);

const transactions = require("./transactions");
Router.use("/transactions", transactions);

const orders = require("./orders");
Router.use("/orders", orders);

const itemOrders = require("./itemOrders");
Router.use("/item-orders", itemOrders);

module.exports = Router;
