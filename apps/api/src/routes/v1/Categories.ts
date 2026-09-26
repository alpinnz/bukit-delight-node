import express = require("express");

const router = express.Router();
const PrismaCatalog = require("./../../controllers/PrismaCatalog");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { uploadImage } = require("./../../config/Multer");

router.get("/", PrismaCatalog.Categories.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaCatalog.Categories.ReadOne);
router.post("/", uploadImage.single("image"), PrismaCatalog.Categories.Create);
router.put(
  "/:_id",
  CheckIdentifier,
  uploadImage.single("image"),
  PrismaCatalog.Categories.Update,
);
router.delete("/:_id", CheckIdentifier, PrismaCatalog.Categories.Delete);

export = router;
