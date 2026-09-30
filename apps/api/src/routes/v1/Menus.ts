import express = require("express");

const router = express.Router();
const catalogController = require("../../controllers/catalog.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { uploadImage } = require("../../config/multer");

router.get("/", catalogController.menus.readAll);
router.get("/:id", checkIdentifier, catalogController.menus.readOne);
router.post("/", uploadImage.single("image"), catalogController.menus.create);
router.put(
  "/:id",
  checkIdentifier,
  uploadImage.single("image"),
  catalogController.menus.update,
);
router.patch(
  "/:id/availability",
  checkIdentifier,
  uploadImage.none(),
  catalogController.menus.updateAvailability,
);
router.delete("/:id", checkIdentifier, catalogController.menus.delete);

export = router;
