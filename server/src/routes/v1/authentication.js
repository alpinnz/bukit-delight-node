const Router = require("express").Router();
const multer = require("./../../config/Multer");
const Authentication = require("./../../controllers/Authentication");

Router.post("/register", multer.none, Authentication.Register);

Router.post("/login", multer.none, Authentication.Login);

Router.post("/forgot-password", multer.none, Authentication.ForgotPassword);

Router.post("/reset-password", multer.none, Authentication.ResetPassword);

Router.post("/activate", multer.none, Authentication.Activate);

Router.post("/logout", Authentication.Logout);

Router.post("/refresh-token", Authentication.RefreshToken);

module.exports = Router;
