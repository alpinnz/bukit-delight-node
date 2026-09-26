import express = require("express");

const router = express.Router();
const PrismaItemOrders = require("../../controllers/PrismaItemOrders");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");

router.get("/", PrismaItemOrders.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaItemOrders.ReadOne);
router.post("/", Multer.none, PrismaItemOrders.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaItemOrders.Update);
router.delete("/:_id", CheckIdentifier, PrismaItemOrders.Delete);

export = router;
