// --- services/recovery.service.ts ---

import { BadRequestError, loadConfig, NotFoundError } from "../lib";
import { ErrorCodes } from "../lib/constants";
import {
  generateVerificationCode,
  normalizeEmail,
  sendPasswordResetEmail,
} from "../lib/utils";
import { UserModel } from "../modals";
import { VerificationCodeModel } from "../modals/VerificationCode";
import { PasswordRequestResult } from "../types";
import { findExistingUserByUsernameOrEmail } from "./user.services";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const sendForgotPasswordEmail = async (email: string) => {
  // Placeholder logic for sending password reset email
};

const resetUserPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  // Find the user by ID
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found", ErrorCodes.USER_NOT_FOUND);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;

  // Save the updated user
  await user.save();
};

const sendVerificationEmail = async (userId: string) => {
  // Placeholder logic for sending email verification link
};

const verifyUserAccount = async (token: string) => {
  // Placeholder logic for verifying account using a token
};

const resendVerificationEmail = async (email: string) => {
  // Placeholder logic for resending verification link
};

const requestPasswordReset = async (
  usernameOrEmail: string
): Promise<PasswordRequestResult | null> => {
  const config = loadConfig();
  const normalizedEmail = normalizeEmail(usernameOrEmail);

  const user = await findExistingUserByUsernameOrEmail({
    username: usernameOrEmail,
    email: usernameOrEmail,
    normalizedEmail,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.email) {
    throw new Error(
      "User does not have an email associated with their account"
    );
  }

  const MAX_RESET_REQUESTS = config.PASSWORD_RESET_RATE_LIMIT || 5;
  const WINDOW_MINUTES = config.PASSWORD_RESET_WINDOW_MINUTES || 15;
  const PASSWORD_RESET_EXPIRATION_MINUTES =
    config.PASSWORD_RESET_EXPIRATION_MINUTES || 10;

  // ✅ Proper rate-limiting check
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const recentRequests = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: "PASSWORD_RESET",
    createdAt: { $gte: windowStart },
  });

  if (recentRequests >= MAX_RESET_REQUESTS) {
    throw new Error(
      "Too many password reset requests. Please try again later."
    );
  }

  const code = generateVerificationCode(); // e.g., "58493"
  const linkToken = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(linkToken).digest("hex");

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    code, // 5-digit code
    hash, // sha256(linkToken)
    type: "PASSWORD_RESET",
    expiresAt: new Date(
      Date.now() + 1000 * 60 * PASSWORD_RESET_EXPIRATION_MINUTES
    ),
    metadata: {
      // optional: ip address, userAgent, etc.
    },
  });

  if (!verificationCode) {
    throw new NotFoundError(
      "Failed to create password reset code",
      ErrorCodes.VERIFICATION_CODE_NOT_FOUND
    );
  }

  // ✅ Send both `code` (for manual entry) and `linkToken` (for URL link)
  await sendPasswordResetEmail(user.email, code, linkToken);

  const result: PasswordRequestResult = {
    token: linkToken,
    hash,
    userId: user._id.toString(),
    expiresAt: verificationCode.expiresAt,
    expireInSeconds: (verificationCode.expiresAt.getTime() - Date.now()) / 1000,
  };

  deleteExpiredVerificationCodes();

  return result;
};

const deleteExpiredVerificationCodes = async () => {
  await VerificationCodeModel.deleteMany({
    type: "PASSWORD_RESET",
    status: "PENDING",
    expiresAt: { $lt: new Date() },
  });
};
export {
  sendForgotPasswordEmail,
  resetUserPassword,
  sendVerificationEmail,
  verifyUserAccount,
  resendVerificationEmail,
  requestPasswordReset,
  deleteExpiredVerificationCodes,
};
