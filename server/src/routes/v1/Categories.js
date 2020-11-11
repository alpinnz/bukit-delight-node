const Router = require("express").Router();
const Categories = require("./../../controllers/Categories");
const { Mongoose } = require("./../../middlewares");
const { uploadImage } = require("./../../config/Multer");

/* GET Account page. */
Router.get("/", Categories.ReadAll);

/* GET Account page. */
Router.get("/:_id", Mongoose.CheckObjectId, Categories.ReadOne);

/* POST Account page. */
Router.post("/", uploadImage.single("image"), Categories.Create);

/* PUT Account page. */
Router.put(
  "/:_id",
  Mongoose.CheckObjectId,
  uploadImage.single("image"),
  Categories.Update
);

/* DELETE Account page. */
Router.delete("/:_id", Mongoose.CheckObjectId, Categories.Delete);

module.exports = Router;
