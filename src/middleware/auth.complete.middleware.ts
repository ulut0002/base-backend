import { NextFunction, Request, Response } from "express";
import { BadRequestError, loadConfig } from "../lib";
import { minutesToMilliseconds } from "../lib/utils";
import { log } from "console";

const registerComplete = (req: Request, res: Response, next: NextFunction) => {
  const envConfig = loadConfig();
  if (req.xData!.success) {
    res
      .cookie(envConfig.cookieName!, req.xData!.registrationToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: minutesToMilliseconds(envConfig.cookieExpirationMinutes!),
      })
      .status(201)
      .json({ message: "Authentication successful" });
    return;
  } else {
    if (!req.xData!.token) {
      next(
        new BadRequestError("User already exists")
          .withIssues(req.xMeta!.errors)
          .withIssues(req.xMeta!.warnings)
          .withIssues(req.xMeta!.messages)
      );
      return;
    }
  }

  return;
};

export { registerComplete };
