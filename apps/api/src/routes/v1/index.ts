import express = require("express");
import type { NextFunction, Request, Response } from "express";

const router = express.Router();
const middlewares = require("../../middlewares");

const staff = middlewares.authentication.checkAccessToken;
const owner = middlewares.authentication.requireRoles("owner");
const staffOperations = middlewares.authentication.requireRoles(
  "cashier",
  "owner",
);
const customerOrStaff = middlewares.authentication.checkCustomerOrStaffToken;
const customer = middlewares.authentication.checkCustomerToken;

const requireOwnerForWrites = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "GET") return next();
  return staff(req, res, (error: unknown) => {
    if (error) return next(error);
    return owner(req, res, next);
  });
};

const requireStaffOperationForWrites = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "GET") return next();
  return staff(req, res, (error: unknown) => {
    if (error) return next(error);
    return staffOperations(req, res, next);
  });
};

const requireCustomerOrderPolicy = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "GET") return customerOrStaff(req, res, next);
  if (req.method === "POST") return customer(req, res, next);
  return staff(req, res, (error: unknown) => {
    if (error) return next(error);
    return staffOperations(req, res, next);
  });
};

router.get("/", staff, (req: Request, res: Response) => {
  res.json({ index: "index" });
});

const authenticationRoutes = require("./authentication");
router.use("/auth", authenticationRoutes);

const userRoutes = require("./users");
router.use("/users", staff, owner, userRoutes);

const categoryRoutes = require("./categories");
router.use("/categories", requireOwnerForWrites, categoryRoutes);

const menuRoutes = require("./menus");
router.use("/menus", requireStaffOperationForWrites, menuRoutes);

const tableRoutes = require("./tables");
router.use("/tables", requireOwnerForWrites, tableRoutes);

const transactionRoutes = require("./transactions");
router.use("/transactions", staff, staffOperations, transactionRoutes);

const orderRoutes = require("./orders");
router.use("/orders", requireCustomerOrderPolicy, orderRoutes);

const orderItemRoutes = require("./order-items");
router.use("/order-items", staff, staffOperations, orderItemRoutes);

const roleRoutes = require("./roles");
router.use("/roles", staff, owner, roleRoutes);

const customerRoutes = require("./customers");
router.use("/customers", staff, owner, customerRoutes);

const recommendationRoutes = require("./recommendations");
router.use("/recommendations", staff, owner, recommendationRoutes);

export = router;
