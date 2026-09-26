import express = require("express");

const router = express.Router();
const PrismaMachine = require("../../controllers/PrismaMachine");

router.get("/favorite", PrismaMachine.Favorite);

export = router;
