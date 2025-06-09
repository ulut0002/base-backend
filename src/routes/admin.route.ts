import express from "express";
import passport from "passport";
import { fetchUserById, fetchUsers } from "../controllers/user.controller";

const adminRouter = express.Router();

// Admin routes
adminRouter.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  fetchUsers
);
adminRouter.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  fetchUserById
);

export { adminRouter };
