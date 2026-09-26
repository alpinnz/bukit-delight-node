import express = require("express");

const router = express.Router();
const PrismaCatalog = require("./../../controllers/PrismaCatalog");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { uploadImage } = require("./../../config/Multer");

router.get("/", PrismaCatalog.Menus.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaCatalog.Menus.ReadOne);
router.post("/", uploadImage.single("image"), PrismaCatalog.Menus.Create);
router.put(
  "/:_id",
  CheckIdentifier,
  uploadImage.single("image"),
  PrismaCatalog.Menus.Update,
);
router.put(
  "/isAvailable/:_id",
  CheckIdentifier,
  uploadImage.none(),
  PrismaCatalog.Menus.UpdateisAvailable,
);
router.delete("/:_id", CheckIdentifier, PrismaCatalog.Menus.Delete);

export = router;
