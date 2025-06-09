// --- controllers/security.controller.ts ---

import { Request, Response } from "express";
import {
  disableTwoFactorAuth,
  enableTwoFactorAuth,
  listActiveSessions,
  logoutOtherSessions,
  verifyTwoFactorCode,
} from "../services";

export const getSessions = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const sessions = await listActiveSessions(userId);
  res.json({ sessions });
};

export const postLogoutOthers = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const currentSessionId = (req.user as any).sessionID;
  await logoutOtherSessions(userId, currentSessionId);
  res.status(200).json({ message: "Other sessions terminated" });
};

export const postEnable2FA = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const secret = req.body.secret;
  const result = await enableTwoFactorAuth(userId, secret);
  res.json(result);
};

export const postDisable2FA = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  await disableTwoFactorAuth(userId);
  res.status(200).json({ message: "2FA disabled" });
};

export const postVerify2FA = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const code = req.body.code;
  const isValid = await verifyTwoFactorCode(userId, code);
  if (!isValid) {
    res.status(401).json({ message: "Invalid 2FA code" });
    return;
  }

  res.status(200).json({ message: "2FA verified" });
};
