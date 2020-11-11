const Router = require("express").Router();
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");
const Transactions = require("./../../controllers/Transactions");

/* GET Account page. */
Router.get("/", Transactions.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Transactions.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, Transactions.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, Transactions.Update);

/* PUT Account page. */
Router.put(
  "/status/:_id",
  Mongoose.CheckObjectId,
  Multer.none,
  Transactions.UpdateStatus
);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Transactions.Delete);

module.exports = Router;
