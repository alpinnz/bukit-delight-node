const Router = require("express").Router();
const Response = require("./../../middlewares/Response");

Router.post("/login", async (req, res) => {
  const {} = req.body;
  return Response.Success(res, "Login");
});

Router.post("/register", async (req, res) => {
  const {} = req.body;
  return Response.Success(res, "Register");
});

Router.post("/forgot-password", async (req, res) => {
  const {} = req.body;
  return Response.Success(res, "Forgot Password");
});

module.exports = Router;
