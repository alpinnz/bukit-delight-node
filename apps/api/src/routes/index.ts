import express = require("express");
import type { Request, Response } from "express";

const router = express.Router();
const versionOneRoutes = require("./v1");

router.use("/api/v1", versionOneRoutes);

router.get("/", (req: Request, res: Response) => {
  const application = req.app as Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
  application.io.emit("FromAPI", "test");
  res.json("index");
});

export = router;
