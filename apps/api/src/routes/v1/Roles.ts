import express = require("express");

const router = express.Router();
const rolesController = require("../../controllers/roles.controller");

router.get("/", rolesController.readAll);

export = router;
