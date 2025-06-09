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
 * @route   GET /me/
 * @desc    Retrieve the profile of the currently authenticated user.
 * @access  Protected (JWT required)
 */
meRouter.get("/", passport.authenticate("jwt", { session: false }), profile);

/**
 * @route   PUT /me/email
 * @desc    Update the email address of the authenticated user.
 * @access  Protected (JWT required)
 */
meRouter.put(
  "/email",
  passport.authenticate("jwt", { session: false }),
  updateEmail
);

/**
 * @route   PUT /me/username
 * @desc    Update the username of the authenticated user.
 * @access  Protected (JWT required)
 */
meRouter.put(
  "/username",
  passport.authenticate("jwt", { session: false }),
  updateUsername
);

/**
 * @route   POST /me/deactivate
 * @desc    Soft-delete the account (can be reactivated later).
 * @access  Protected (JWT required)
 */
meRouter.post(
  "/deactivate",
  passport.authenticate("jwt", { session: false }),
  deactivateAccount
);

/**
 * @route   POST /me/reactivate
 * @desc    Reactivate a previously deactivated account.
 * @access  Protected (JWT required)
 */
meRouter.post(
  "/reactivate",
  passport.authenticate("jwt", { session: false }),
  reactivateAccount
);

/**
 * @route   PATCH /me/:id
 * @desc    Update additional user details (if supported).
 * @access  Protected (JWT required)
 * @note    :id should match the authenticated user ID
 */
meRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  patchUpdateAccount
);

/**
 * @route   DELETE /me/:id
 * @desc    Permanently delete the user account (cannot be undone).
 * @access  Protected (JWT required)
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
 * @route   GET /me/users/public/:username
 * @desc    Retrieve the public profile of any user by username.
 * @access  Public
 */
meRouter.get("/users/public/:username", fetchPublicProfile);

export { meRouter };
