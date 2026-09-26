import express = require("express");

const router = express.Router();
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");
const PrismaTransactions = require("../../controllers/PrismaTransactions");

router.get("/", PrismaTransactions.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaTransactions.ReadOne);
router.post("/", Multer.none, PrismaTransactions.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaTransactions.Update);
router.put(
  "/status/:_id",
  CheckIdentifier,
  Multer.none,
  PrismaTransactions.UpdateStatus,
);
router.delete("/:_id", CheckIdentifier, PrismaTransactions.Delete);

export = router;
