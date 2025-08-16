import { NextFunction, Request, Response } from "express";

const meProfilePre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-me #1 middleware executed");
  next();
};

const meProfilePre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-me #2 middleware executed");
  next();
};

const updateEmailPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-updateEmail #1 middleware executed");
  next();
};

const updateEmailPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-updateEmail #2 middleware executed");
  next();
};

const updateUsernamePre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-updateUsername #1 middleware executed");
  next();
};
const updateUsernamePre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-updateUsername #2 middleware executed");
  next();
};

const deactivateAccountPre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-deactivateAccount #1 middleware executed");
  next();
};
const deactivateAccountPre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-deactivateAccount #2 middleware executed");
  next();
};
const reactivateAccountPre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-reactivateAccount #1 middleware executed");
  next();
};
const reactivateAccountPre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Pre-reactivateAccount #2 middleware executed");
  next();
};

const singleUserPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-singleUserProfile #1 middleware executed");
  next();
};

const singleUserPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-singleUserProfile #2 middleware executed");
  next();
};

const deleteAccountPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-deleteAccount #1 middleware executed");
  next();
};

const deleteAccountPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-deleteAccount #2 middleware executed");
  next();
};

const publicProfilePre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-publicProfile #1 middleware executed");
  next();
};

const publicProfilePre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Pre-publicProfile #2 middleware executed");
  next();
};

export {
  meProfilePre1,
  meProfilePre2,
  updateEmailPre1,
  updateEmailPre2,
  updateUsernamePre1,
  updateUsernamePre2,
  deactivateAccountPre1,
  deactivateAccountPre2,
  reactivateAccountPre1,
  reactivateAccountPre2,
  singleUserPre1,
  singleUserPre2,
  deleteAccountPre1,
  deleteAccountPre2,
  publicProfilePre1,
  publicProfilePre2,
};
