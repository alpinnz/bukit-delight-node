import express = require("express");

const router = express.Router();
const customersController = require("../../controllers/customers.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");

router.get("/", customersController.readAll);
router.get("/:id", checkIdentifier, customersController.readOne);
router.put("/:id", checkIdentifier, multer.none, customersController.update);
router.delete("/:id", checkIdentifier, customersController.delete);

export = router;
