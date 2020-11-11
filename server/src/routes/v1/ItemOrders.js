const Router = require("express").Router();
const ItemOrders = require("./../../controllers/ItemOrders");
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");

/* GET Account page. */
Router.get("/", ItemOrders.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, ItemOrders.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, ItemOrders.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, ItemOrders.Update);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, ItemOrders.Delete);

module.exports = Router;
