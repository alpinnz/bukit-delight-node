import express = require("express");

const router = express.Router();
const { checkIdentifier } = require("../../middlewares/identifier");
const { multer } = require("../../config");
const transactionsController = require("../../controllers/transactions.controller");

router.get("/", transactionsController.readAll);
router.get("/:id", checkIdentifier, transactionsController.readOne);
router.post("/", multer.none, transactionsController.create);
router.put("/:id", checkIdentifier, multer.none, transactionsController.update);
router.patch(
  "/:id/status",
  checkIdentifier,
  multer.none,
  transactionsController.updateStatus,
);
router.delete("/:id", checkIdentifier, transactionsController.delete);

export = router;
