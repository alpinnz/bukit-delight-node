import express = require("express");

const router = express.Router();
const PrismaCatalog = require("./../../controllers/PrismaCatalog");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("./../../config");

router.get("/", PrismaCatalog.Tables.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaCatalog.Tables.ReadOne);
router.post("/", Multer.none, PrismaCatalog.Tables.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaCatalog.Tables.Update);
router.delete("/:_id", CheckIdentifier, PrismaCatalog.Tables.Delete);

export = router;
