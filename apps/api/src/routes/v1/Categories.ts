import express = require("express");

const router = express.Router();
const catalogController = require("../../controllers/catalog.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { uploadImage } = require("../../config/multer");

router.get("/", catalogController.categories.readAll);
router.get("/:id", checkIdentifier, catalogController.categories.readOne);
router.post("/", uploadImage.single("image"), catalogController.categories.create);
router.put(
  "/:id",
  checkIdentifier,
  uploadImage.single("image"),
  catalogController.categories.update,
);
router.delete("/:id", checkIdentifier, catalogController.categories.delete);

export = router;
