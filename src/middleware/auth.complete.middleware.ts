import { NextFunction, Request, Response } from "express";
import { BadRequestError, loadConfig, logger } from "../lib";
import { minutesToMilliseconds } from "../lib/utils";
import { log } from "console";

const registerComplete = (req: Request, res: Response, next: NextFunction) => {
  const envConfig = loadConfig();
  const success = !req.xMeta?.hasErrors();
  if (success) {
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
      next(new BadRequestError("Failed to register user"));
      return;
    }
  }

  return;
};

const loginComplete = (req: Request, res: Response, next: NextFunction) => {
  const envConfig = loadConfig();
  const success = !req.xMeta?.hasErrors();

  const token = req.xData?.loginToken || null;
  if (!success) {
    return next(new BadRequestError("Login has failed for some reason"));
  }

  res
    .cookie(envConfig.cookieName!, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: minutesToMilliseconds(envConfig.cookieExpirationMinutes!),
    })
    .status(200)
    .json({
      message: "Authentication successful",
      warnings: req.xMeta?.getWarnings(),
      messages: req.xMeta?.getMessages(),
    });
};

export { registerComplete, loginComplete };
