import express = require("express");

const router = express.Router();
const recommendationsController = require("../../controllers/recommendations.controller");

router.get("/favorites", recommendationsController.getFavoriteAnalysis);

export = router;
