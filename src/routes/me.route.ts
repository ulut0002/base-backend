// src/routes/me.ts

import express, { Router } from "express";
import passport from "passport";
import {
  deactivateAccount,
  deleteAccount,
  fetchPublicProfile,
  patchUpdateAccount,
  profile,
  reactivateAccount,
  updateEmail,
  updateUsername,
} from "../controllers";

const meRouter: Router = express.Router();

/**
 * ┌────────────────────────────┐
 * │    Authenticated User      │
 * └────────────────────────────┘
 */

/**
 * @openapi
 * /me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
meRouter.get("/", passport.authenticate("jwt", { session: false }), profile);

/**
 * @openapi
 * /me/email:
 *   put:
 *     summary: Update the authenticated user's email
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 */
meRouter.put(
  "/email",
  passport.authenticate("jwt", { session: false }),
  updateEmail
);

/**
 * @openapi
 * /me/username:
 *   put:
 *     summary: Update the authenticated user's username
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 */
meRouter.put(
  "/username",
  passport.authenticate("jwt", { session: false }),
  updateUsername
);

/**
 * @openapi
 * /me/deactivate:
 *   post:
 *     summary: Deactivate the authenticated user's account
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 */
meRouter.post(
  "/deactivate",
  passport.authenticate("jwt", { session: false }),
  deactivateAccount
);

/**
 * @openapi
 * /me/reactivate:
 *   post:
 *     summary: Reactivate a previously deactivated account
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account reactivated successfully
 */
meRouter.post(
  "/reactivate",
  passport.authenticate("jwt", { session: false }),
  reactivateAccount
);

/**
 * @openapi
 * /me/{id}:
 *   patch:
 *     summary: Update additional user details
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (should match the authenticated user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User details updated
 */
meRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  patchUpdateAccount
);

/**
 * @openapi
 * /me/{id}:
 *   delete:
 *     summary: Permanently delete the authenticated user's account
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (should match the authenticated user)
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
meRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteAccount
);

/**
 * ┌────────────────────────────┐
 * │       Public Access        │
 * └────────────────────────────┘
 */

/**
 * @openapi
 * /me/users/public/{username}:
 *   get:
 *     summary: Get a public user profile by username
 *     tags: [Me]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the public profile to fetch
 *     responses:
 *       200:
 *         description: Public profile data
 *       404:
 *         description: User not found
 */
meRouter.get("/users/public/:username", fetchPublicProfile);

export { meRouter };
