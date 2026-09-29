import express = require("express");
import type { NextFunction, Request, Response } from "express";

const router = express.Router();
const middlewares = require("../../middlewares");

const staff = middlewares.Authentication.checkAccessToken;
const owner = middlewares.Authentication.requireRoles("owner");
const staffOperations = middlewares.Authentication.requireRoles(
  "cashier",
  "owner",
);
const customerOrStaff = middlewares.Authentication.checkCustomerOrStaffToken;
const customer = middlewares.Authentication.checkCustomerToken;

const requireAdminForWrites = (
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

const Authentication = require("./Authentication");
router.use("/Authentication", Authentication);

const Users = require("./Users");
router.use("/users", staff, owner, Users);

const Categories = require("./Categories");
router.use("/Categories", requireAdminForWrites, Categories);

const Menus = require("./Menus");
router.use("/Menus", requireStaffOperationForWrites, Menus);

const Tables = require("./Tables");
router.use("/Tables", requireAdminForWrites, Tables);

const Transactions = require("./Transactions");
router.use("/Transactions", staff, staffOperations, Transactions);

const Orders = require("./Orders");
router.use("/Orders", requireCustomerOrderPolicy, Orders);

const ItemOrders = require("./ItemOrders");
router.use("/item-orders", staff, staffOperations, ItemOrders);

const Roles = require("./Roles");
router.use("/roles", staff, owner, Roles);

const Customers = require("./Customers");
router.use("/customers", staff, owner, Customers);

const Machine = require("./Machine");
router.use("/machine", staff, owner, Machine);

export = router;
