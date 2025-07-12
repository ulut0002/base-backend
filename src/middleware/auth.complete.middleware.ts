import { NextFunction, Request, Response } from "express";
import { BadRequestError, loadConfig } from "../lib";
import { minutesToMilliseconds } from "../lib/utils";

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
  } else {
    if (!req.authToken) {
      return next(new BadRequestError("Missing token"));
    }
  }

  return;
};

export { registerComplete };
