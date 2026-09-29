import express = require("express");

const router = express.Router();
const multer = require("./../../config/Multer");
const PrismaAuthentication = require("./../../controllers/PrismaAuthentication");
const rateLimits = require("./../../middlewares/AuthenticationRateLimit");

router.post(
  "/register",
  rateLimits.registration,
  multer.none,
  PrismaAuthentication.Register,
);
router.post(
  "/login",
  rateLimits.login,
  multer.none,
  PrismaAuthentication.Login,
);
router.post(
  "/forgot-password",
  rateLimits.recovery,
  multer.none,
  PrismaAuthentication.ForgotPassword,
);
router.post(
  "/reset-password",
  rateLimits.tokenVerification,
  multer.none,
  PrismaAuthentication.ResetPassword,
);
router.post(
  "/activate",
  rateLimits.tokenVerification,
  multer.none,
  PrismaAuthentication.Activate,
);
router.post("/logout", PrismaAuthentication.Logout);
router.post("/refresh-token", PrismaAuthentication.RefreshToken);

export = router;
