const Router = require("express").Router();
const middlewares = require("./../../middlewares");

Router.get(
  "/",
  middlewares.Authentication.checkAccessToken,
  (req, res, next) => {
    res.json({ index: "index" });
  }
);

const Authentication = require("./Authentication");
Router.use("/Authentication", Authentication);

const Accounts = require("./Accounts");
Router.use("/Accounts", Accounts);

const Categories = require("./Categories");
Router.use("/Categories", Categories);

const Menus = require("./Menus");
Router.use("/Menus", Menus);

const Tables = require("./Tables");
Router.use("/Tables", Tables);

const Transactions = require("./Transactions");
Router.use("/Transactions", Transactions);

const Orders = require("./Orders");
Router.use("/Orders", Orders);

const ItemOrders = require("./ItemOrders");
Router.use("/item-orders", ItemOrders);

module.exports = Router;
