import express = require("express");

const router = express.Router();
const orderItemsController = require("../../controllers/order-items.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");

router.get("/", orderItemsController.readAll);
router.get("/:id", checkIdentifier, orderItemsController.readOne);
router.post("/", multer.none, orderItemsController.create);
router.put("/:id", checkIdentifier, multer.none, orderItemsController.update);
router.delete("/:id", checkIdentifier, orderItemsController.delete);

export = router;
