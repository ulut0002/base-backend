// --- services/recovery.service.ts ---

import { loadConfig } from "../lib";
import {
  generateVerificationCode,
  normalizeEmail,
  sendPasswordResetEmail,
} from "../lib/utils";
import { VerificationCodeModel } from "../modals/VerificationCode";
import { findExistingUserByUsernameOrEmail } from "./user.services";

const sendForgotPasswordEmail = async (email: string) => {
  // Placeholder logic for sending password reset email
};

const resetUserPassword = async (token: string, newPassword: string) => {
  // Placeholder logic for resetting the user's password using a token
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

const requestPasswordReset = async (usernameOrEmail: string) => {
  const config = loadConfig();
  const normalizedEmail = normalizeEmail(usernameOrEmail);
  const user = await findExistingUserByUsernameOrEmail({
    username: usernameOrEmail,
    email: normalizedEmail,
  });

  if (!user || !user.email) {
    throw new Error("User not found or email not available");
  }

  const MAX_RESET_REQUESTS = config.PASSWORD_RESET_RATE_LIMIT || 0;
  const WINDOW_MINUTES = config.PASSWORD_RESET_WINDOW_MINUTES || 0;
  const PASSWORD_RESET_EXPIRATION_MINUTES: number =
    config.PASSWORD_RESET_EXPIRATION_MINUTES || 10;

  if (!MAX_RESET_REQUESTS || !WINDOW_MINUTES) {
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
    const recentRequests = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: "PASSWORD_RESET",
      createdAt: { $gte: windowStart },
    });
    if (recentRequests >= MAX_RESET_REQUESTS) {
      throw new Error(
        `Too many password reset requests. Please try again later.`
      );
    }
  }

  const code = generateVerificationCode();

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    code,
    type: "PASSWORD_RESET",
    expiresAt: new Date(
      Date.now() + 1000 * 60 * PASSWORD_RESET_EXPIRATION_MINUTES
    ), // 10 minutes from now
    metadata: {
      // ip: req.ip
    },
  });

  if (verificationCode) {
    await sendPasswordResetEmail(user.email, code);
  } else {
    throw new Error("Failed to create password reset code");
  }
};

export {
  sendForgotPasswordEmail,
  resetUserPassword,
  sendVerificationEmail,
  verifyUserAccount,
  resendVerificationEmail,
  requestPasswordReset,
};
