import express = require("express");

const router = express.Router();
const ordersController = require("../../controllers/orders.controller");
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");

router.get("/", ordersController.readAll);
router.get("/:id", checkIdentifier, ordersController.readOne);
router.post("/", multer.none, ordersController.create);
router.put("/:id", checkIdentifier, multer.none, ordersController.update);
router.patch(
  "/:id/status",
  checkIdentifier,
  multer.none,
  ordersController.updateStatus,
);
router.delete("/:id", checkIdentifier, ordersController.delete);

export = router;
