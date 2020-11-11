const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { } = req.body;
  res.send("api");
});

const v1 = require("./v1");
router.use("/v1", v1);

module.exports = router;
