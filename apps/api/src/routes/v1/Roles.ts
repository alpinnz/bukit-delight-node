import express = require("express");

const router = express.Router();
const PrismaRoles = require("../../controllers/PrismaRoles");

router.get("/", PrismaRoles.ReadAll);

export = router;
