const Router = require("express").Router();
const Accounts = require("./../../controllers/Accounts");
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");

/* GET Account page. */
Router.get("/", Accounts.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Accounts.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, Accounts.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, Accounts.Update);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Accounts.Delete);

module.exports = Router;
