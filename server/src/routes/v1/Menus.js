const Router = require("express").Router();
const Menus = require("./../../controllers/Menus");
const { Mongoose } = require("./../../middlewares");
const { uploadImage } = require("./../../config/Multer");

/* GET Account page. */
Router.get("/", Menus.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Menus.ReadOne);

/* POST Account page. */
Router.post("/", uploadImage.single("image"), Menus.Create);

/* PUT Account page. */
Router.put(
  "/:_id",
  Mongoose.CheckObjectId,
  uploadImage.single("image"),
  Menus.Update
);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Menus.Delete);

module.exports = Router;
