import express = require("express");

const router = express.Router();
const multer = require("./../../config/Multer");
const PrismaAuthentication = require("./../../controllers/PrismaAuthentication");

router.post("/register", multer.none, PrismaAuthentication.Register);
router.post("/login", multer.none, PrismaAuthentication.Login);
router.post(
  "/forgot-password",
  multer.none,
  PrismaAuthentication.ForgotPassword,
);
router.post("/reset-password", multer.none, PrismaAuthentication.ResetPassword);
router.post("/activate", multer.none, PrismaAuthentication.Activate);
router.post("/logout", PrismaAuthentication.Logout);
router.post("/refresh-token", PrismaAuthentication.RefreshToken);

export = router;
