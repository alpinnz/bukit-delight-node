import express = require("express");

const router = express.Router();
const usersController = require("../../controllers/users.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");

router.get("/", usersController.readAll);
router.get("/:id", checkIdentifier, usersController.readOne);
router.post("/", multer.none, usersController.create);
router.put("/:id", checkIdentifier, multer.none, usersController.update);
router.delete("/:id", checkIdentifier, usersController.delete);

export = router;
