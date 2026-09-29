import express = require("express");

const router = express.Router();
const PrismaUsers = require("../../controllers/PrismaUsers");
const { CheckIdentifier } = require("../../middlewares/Identifier");
const { Multer } = require("../../config");

router.get("/", PrismaUsers.ReadAll);
router.get("/:_id", CheckIdentifier, PrismaUsers.ReadOne);
router.post("/", Multer.none, PrismaUsers.Create);
router.put("/:_id", CheckIdentifier, Multer.none, PrismaUsers.Update);
router.delete("/:_id", CheckIdentifier, PrismaUsers.Delete);

export = router;
