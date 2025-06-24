import { NextFunction, Request, Response } from "express";

const loginPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-login #1 middleware executed");
  next();
};

const loginPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-login #2 middleware executed");
  next();
};

const registerPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-register #1 middleware executed");
  next();
};
const registerPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-register #2 middleware executed");
  next();
};

const mePost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-me #1 middleware executed");
  next();
};
const mePost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-me #2 middleware executed");
  next();
};
const logoutPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-logout #1 middleware executed");
  next();
};
const logoutPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-logout #2 middleware executed");
  next();
};
const changePasswordPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-changePassword #1 middleware executed");
  next();
};

const changePasswordPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-changePassword #2 middleware executed");
  next();
};

const refreshTokenPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-refreshToken #1 middleware executed");
  next();
};
const refreshTokenPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-refreshToken #2 middleware executed");
  next();
};

const statusPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-status #1 middleware executed");
  next();
};

const statusPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-status #2 middleware executed");
  next();
};

export {
  loginPost1,
  loginPost2,
  registerPost1,
  registerPost2,
  mePost1,
  mePost2,
  logoutPost1,
  logoutPost2,
  changePasswordPost1,
  changePasswordPost2,
  refreshTokenPost1,
  refreshTokenPost2,
  statusPost1,
  statusPost2,
};
