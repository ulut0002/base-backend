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
import { findExistingUserByUsernameOrEmail } from "./user.services";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  CreateVerificationRequest,
  CreateVerificationResult,
  ResetPasswordRequest,
  ResetPasswordResult,
  UserDocument,
} from "../types";

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

const sendVerificationEmail = async ({ email }: CreateVerificationRequest) => {
  // Placeholder logic for sending email verification link
};

// This either creates a new verification code or returns an existing one
const createVerificationToken = async ({
  email,
  sendEmail = false,
}: CreateVerificationRequest): Promise<CreateVerificationResult | null> => {
  if (!email) {
    throw new BadRequestError("Email is required", ErrorCodes.MISSING_EMAIL);
  }
  const emailNormalized = normalizeEmail(email);

  let user = await findExistingUserByUsernameOrEmail({
    usernameOrEmail: email,
  });
  if (!user) {
    user = await findExistingUserByUsernameOrEmail({
      normalizedEmail: emailNormalized,
    });
  }

  if (!user) {
    throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
  }

  if (user.isVerified) {
    throw new BadRequestError(
      "User account is already verified",
      ErrorCodes.USER_ALREADY_VERIFIED
    );
  }

  if (!user.password) {
    throw new BadRequestError(
      "User does not need to verify their account",
      ErrorCodes.USER_ALREADY_VERIFIED
    );
  }

  // if there is an existing verification code, return it
  let existingCode = await VerificationCodeModel.findOne({
    userId: user._id,
    type: "EMAIL_VERIFICATION",
    status: "PENDING",
    expiresAt: { $gt: new Date() },
  });

  if (!existingCode) {
    const config = loadConfig();
    const VERIFICATION_EXPIRATION_MINUTES =
      config.EMAIL_VERIFICATION_EXPIRATION_MINUTES || 10;

    const code = generateVerificationCode(); // e.g., "58493"
    const linkToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(linkToken).digest("hex");
    existingCode = await VerificationCodeModel.create({
      userId: user._id,
      code, // 5-digit code
      hash, // sha256(linkToken)
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(
        Date.now() + 1000 * 60 * VERIFICATION_EXPIRATION_MINUTES
      ),
      metadata: {
        // optional: ip address, userAgent, etc.
      },
    });
  }

  let returnValue: CreateVerificationResult | null = null;

  if (existingCode) {
    if (sendEmail && user.email) {
      // await sendVerificationEmail({ email: user.email });
    }
    returnValue = {
      verificationStatus: "NEEDS_VERIFICATION",
      code: existingCode.code,
      hash: existingCode.hash,
      userId: user._id.toString(),
      expiresAt: existingCode.expiresAt,
      expireInSeconds: (existingCode.expiresAt.getTime() - Date.now()) / 1000,
    };
  }

  deleteExpiredVerificationCodes();

  return returnValue;
};

const verifyUserAccount = async (token: string) => {
  // Placeholder logic for verifying account using a token
};

const resendVerificationEmail = async (user: UserDocument) => {};

const requestPasswordReset = async ({
  emailOrUsername,
  sendEmail = false,
}: ResetPasswordRequest): Promise<ResetPasswordResult | null> => {
  const config = loadConfig();
  const normalizedEmail = normalizeEmail(emailOrUsername);

  const user = await findExistingUserByUsernameOrEmail({
    username: emailOrUsername,
    email: emailOrUsername,
    normalizedEmail,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.email && sendEmail) {
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
  if (sendEmail && user.email) {
    await sendPasswordResetEmail(user.email, code, linkToken);
  }

  const result: ResetPasswordResult = {
    hash: verificationCode.hash,
    code: verificationCode.code,
    userId: user._id.toString(),
    expiresAt: verificationCode.expiresAt,
    expireInSeconds: (verificationCode.expiresAt.getTime() - Date.now()) / 1000,
  };

  deleteExpiredVerificationCodes();

  return result;
};

const deleteExpiredVerificationCodes = async () => {
  await VerificationCodeModel.deleteMany({
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
