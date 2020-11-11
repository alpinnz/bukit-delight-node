const Router = require("express").Router();
const Tables = require("./../../controllers/Tables");
const { Mongoose } = require("./../../middlewares");
const { Multer } = require("./../../config");

/* GET Account page. */
Router.get("/", Tables.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Tables.ReadOne);

/* POST Account page. */
Router.post("/", Multer.none, Tables.Create);

/* PUT Account page. */
Router.put("/:_id", Mongoose.CheckObjectId, Multer.none, Tables.Update);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Tables.Delete);

module.exports = Router;
