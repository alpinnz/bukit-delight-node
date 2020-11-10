const Router = require("express").Router();

Router.get("/", (req, res) => {
  const {} = req.body;
  return res.status(200).json({ message: "Welcome to Express API template" });
});

module.exports = Router;
