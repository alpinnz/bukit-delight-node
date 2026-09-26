import express = require("express");

const router = express.Router();
const PrismaOrders = require("../../controllers/PrismaOrders");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");

router.get("/", PrismaOrders.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaOrders.ReadOne);
router.post("/", Multer.none, PrismaOrders.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaOrders.Update);
router.put(
  "/status/:_id",
  CheckIdentifier,
  Multer.none,
  PrismaOrders.UpdateStatus,
);
router.delete("/:_id", CheckIdentifier, PrismaOrders.Delete);

export = router;
