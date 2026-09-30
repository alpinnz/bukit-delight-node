import express = require("express");

const router = express.Router();
const multer = require("../../config/multer");
const authenticationController = require("../../controllers/authentication.controller");
const rateLimits = require("../../middlewares/authentication-rate-limit");

router.post(
  "/register",
  rateLimits.registration,
  multer.none,
  authenticationController.register,
);
router.post(
  "/login",
  rateLimits.login,
  multer.none,
  authenticationController.login,
);
router.post(
  "/forgot-password",
  rateLimits.recovery,
  multer.none,
  authenticationController.forgotPassword,
);
router.post(
  "/reset-password",
  rateLimits.tokenVerification,
  multer.none,
  authenticationController.resetPassword,
);
router.post(
  "/activate",
  rateLimits.tokenVerification,
  multer.none,
  authenticationController.activate,
);
router.post("/logout", authenticationController.logout);
router.post("/refresh-token", authenticationController.refreshToken);

export = router;
