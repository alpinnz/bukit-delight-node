const Router = require("express").Router();
const Customers = require("./../../controllers/Customers");
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");

/* GET Account page. */
Router.get("/", Customers.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Customers.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, Customers.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, Customers.Update);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Customers.Delete);

module.exports = Router;
