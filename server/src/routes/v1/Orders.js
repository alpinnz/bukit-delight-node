const Router = require("express").Router();
const Orders = require("./../../controllers/Orders");
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");

/* GET Account page. */
Router.get("/", Orders.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Orders.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, Orders.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, Orders.Update);

/* PUT Account page. */
Router.put(
  "/status/:_id",
  Mongoose.CheckObjectId,
  Multer.none,
  Orders.UpdateStatus
);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Orders.Delete);

module.exports = Router;
