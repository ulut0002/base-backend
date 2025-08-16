import { NextFunction, Request, Response } from "express";

const loginPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-login #1 middleware executed");
  next();
};

const loginPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-login #2 middleware executed");
  next();
};

const registerPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-register #1 middleware executed");
  next();
};
const registerPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-register #2 middleware executed");
  next();
};

const mePre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-me #1 middleware executed");
  next();
};
const mePre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-me #2 middleware executed");
  next();
};
const logoutPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-logout #1 middleware executed");
  next();
};
const logoutPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-logout #2 middleware executed");
  next();
};

const requestPasswordChangePre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-requestPasswordChange #1 middleware executed");
  next();
};

const requestPasswordChangePre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-requestPasswordChange #2 middleware executed");
  next();
};

const validatePasswordRequestCodePre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-validatePasswordRequestCode #1 middleware executed");
  next();
};

const validatePasswordRequestCodePre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-validatePasswordRequestCode #2 middleware executed");
  next();
};

const changePasswordPre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-changePassword #1 middleware executed");
  next();
};

const changePasswordPre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-changePassword #2 middleware executed");
  next();
};

const refreshTokenPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-refreshToken #1 middleware executed");
  next();
};
const refreshTokenPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-refreshToken #2 middleware executed");
  next();
};

const statusPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-status #1 middleware executed");
  next();
};

const statusPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-status #2 middleware executed");
  next();
};
export {
  loginPre1,
  loginPre2,
  registerPre1,
  registerPre2,
  mePre1,
  mePre2,
  logoutPre1,
  logoutPre2,
  changePasswordPre1,
  changePasswordPre2,
  refreshTokenPre1,
  refreshTokenPre2,
  statusPre1,
  statusPre2,
  requestPasswordChangePre1,
  requestPasswordChangePre2,
  validatePasswordRequestCodePre1,
  validatePasswordRequestCodePre2,
};
