import { Request, Response } from "express";
import {
  resendVerificationEmail,
  resetUserPassword,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyUserAccount,
} from "../services";
import { requestPasswordReset } from "../services/recovery.services";

export const postForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await sendForgotPasswordEmail(email);
  res.status(200).json({ message: "Password reset email sent" });
};

export const postResetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await resetUserPassword(token, newPassword);
  res.status(200).json({ message: "Password has been reset" });
};

export const postSendVerification = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  await sendVerificationEmail(userId);
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

export const postRequestPasswordReset = async (req: Request, res: Response) => {
  const { emailOrUsername } = req.body;

  requestPasswordReset(emailOrUsername)
    .then(() => {
      res.status(200).json({ message: "Password reset requested" });
    })
    .catch((err: any) => {
      res.status(400).json({
        message: err.message || "Failed to request password reset",
      });
    });
};
