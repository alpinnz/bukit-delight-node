import express = require("express");

const router = express.Router();
const PrismaCustomers = require("../../controllers/PrismaCustomers");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");

router.get("/", PrismaCustomers.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaCustomers.ReadOne);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaCustomers.Update);
router.delete("/:_id", CheckIdentifier, PrismaCustomers.Delete);

export = router;
