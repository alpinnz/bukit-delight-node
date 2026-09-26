import express = require("express");

const router = express.Router();
const PrismaAccounts = require("../../controllers/PrismaAccounts");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");

router.get("/", PrismaAccounts.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaAccounts.ReadOne);
router.post("/", Multer.none, PrismaAccounts.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaAccounts.Update);
router.delete("/:_id", CheckIdentifier, PrismaAccounts.Delete);

export = router;
