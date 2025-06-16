import { Request, Response } from "express";
import crypto from "crypto";
import {
  resendVerificationEmail,
  resetUserPassword,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyUserAccount,
} from "../services";
import { requestPasswordReset } from "../services/recovery.services";
import { VerificationCodeModel } from "../modals/VerificationCode";
import { BadRequestError, createErrorIf, NotFoundError } from "../lib";
import { ErrorCodes } from "../lib/constants";

export const postForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await sendForgotPasswordEmail(email);
  res.status(200).json({ message: "Password reset email sent" });
};

export const postResetPassword = async (req: Request, res: Response) => {
  const { token, hash, newPassword, newPasswordConfirm } = req.body;

  const now: Date = new Date();

  createErrorIf({
    fieldName: "token",
    condition: token,
    ErrorType: BadRequestError,
    details: "Token is required",
    code: ErrorCodes.MISSING_TOKEN,
  });

  createErrorIf({
    fieldName: "hash",
    condition: hash,
    ErrorType: BadRequestError,
    details: "Hash is required",
    code: ErrorCodes.MISSING_HASH,
  });

  createErrorIf({
    fieldName: "newPassword",
    condition: newPassword,
    ErrorType: BadRequestError,
    details: "New password is required",
    code: ErrorCodes.MISSING_PASSWORD,
  });

  createErrorIf({
    fieldName: "newPasswordConfirm",
    condition: newPasswordConfirm,
    ErrorType: BadRequestError,
    details: "New password confirmation is required",
    code: ErrorCodes.MISSING_PASSWORD_CONFIRMATION,
  });

  console.log(
    newPassword,
    newPasswordConfirm,
    newPassword === newPasswordConfirm
  );

  createErrorIf({
    fieldName: "Password confirmation",
    condition: newPasswordConfirm === newPassword,
    ErrorType: BadRequestError,
    details: "Passwords do not match",
    code: ErrorCodes.PASSWORD_NOT_MATCHING,
  });

  // const hashedHash = crypto.createHash("sha256").update(hash).digest("hex");

  const verification = await VerificationCodeModel.findOne({
    type: "PASSWORD_RESET",
    code: token,
    hash: hash,
    status: "PENDING",
    // expiresAt: { $gt: now },
  });

  if (!verification) {
    throw new NotFoundError(
      "Invalid or expired token/hash",
      ErrorCodes.VERIFICATION_CODE_NOT_FOUND
    );
  }

  if (verification.expiresAt < now) {
    throw new BadRequestError(
      "Token has expired",
      ErrorCodes.VERIFICATION_CODE_EXPIRED
    );
  }

  // throw new BadRequestError("This feature is not implemented yet");

  await resetUserPassword(verification.userId.toString(), newPassword);

  verification.status = "VERIFIED";
  verification.verifiedAt = new Date();
  await verification.save();

  res.status(200).json({ message: "Password has been reset successfully." });
  return;
};

export const postSendVerification = async (req: Request, res: Response) => {
  const email = (req.user as any).email;
  // await sendVerificationEmail({ email });
  res.status(200).json({ message: "Verification email sent" });
};

export const postVerifyAccount = async (req: Request, res: Response) => {
  const { token } = req.body;
  await verifyUserAccount(token);
  res.status(200).json({ message: "Account verified" });
};

export const postResendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  await resendVerificationEmail(email);
  res.status(200).json({ message: "Verification email resent" });
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  await resendVerificationEmail(email);
  res.status(200).json({ message: "Verification email resent" });
};

// requestPasswordReset
export const postRequestPasswordReset = async (req: Request, res: Response) => {
  const { emailOrUsername, sendEmail = false } = req.body;

  requestPasswordReset({ emailOrUsername, sendEmail })
    .then((result) => {
      res.status(200).json({
        message: "Password reset requested",
        code: result?.code,
        hash: result?.hash,
        userId: result?.userId,
        expiresAt: result?.expiresAt,
        expireInSeconds: result?.expireInSeconds,
      });
    })
    .catch((err: any) => {
      res.status(400).json({
        message: err.message || "Failed to request password reset",
      });
    });
};
