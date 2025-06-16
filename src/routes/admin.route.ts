// src/routes/admin.ts

import express from "express";
import passport from "passport";
import { fetchUserById, fetchUsers } from "../controllers/user.controller";

const adminRouter = express.Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Fetch all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
adminRouter.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  fetchUsers
);

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     summary: Fetch a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
adminRouter.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  fetchUserById
);

export { adminRouter };
