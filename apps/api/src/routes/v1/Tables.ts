import express = require("express");

const router = express.Router();
const catalogController = require("../../controllers/catalog.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");

router.get("/", catalogController.tables.readAll);
router.get("/:id", checkIdentifier, catalogController.tables.readOne);
router.post("/", multer.none, catalogController.tables.create);
router.put("/:id", checkIdentifier, multer.none, catalogController.tables.update);
router.delete("/:id", checkIdentifier, catalogController.tables.delete);

export = router;
