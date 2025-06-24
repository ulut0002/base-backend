import { NextFunction, Request, Response } from "express";

const mePost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-me #1 middleware executed");
  next();
};

const mePost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-me #2 middleware executed");
  next();
};

const updateEmailPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-updateEmail #1 middleware executed");
  next();
};

const updateEmailPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("Post-updateEmail #2 middleware executed");
  next();
};

const updateUsernamePost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-updateUsername #1 middleware executed");
  next();
};

const updateUsernamePost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-updateUsername #2 middleware executed");
  next();
};

const deactivateAccountPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-deactivateAccount #1 middleware executed");
  next();
};

const deactivateAccountPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-deactivateAccount #2 middleware executed");
  next();
};

const reactivateAccountPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-reactivateAccount #1 middleware executed");
  next();
};

const reactivateAccountPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-reactivateAccount #2 middleware executed");
  next();
};

const singleUserProfilePost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-singleUserProfile #1 middleware executed");
  next();
};

const singleUserProfilePost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-singleUserProfile #2 middleware executed");
  next();
};

const deleteAccountPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-deleteAccount #1 middleware executed");
  next();
};

const deleteAccountPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-deleteAccount #2 middleware executed");
  next();
};

const publicProfilePost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-publicProfile #1 middleware executed");
  next();
};

const publicProfilePost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Post-publicProfile #2 middleware executed");
  next();
};

export {
  mePost1,
  mePost2,
  updateEmailPost1,
  updateEmailPost2,
  updateUsernamePost1,
  updateUsernamePost2,
  deactivateAccountPost1,
  deactivateAccountPost2,
  reactivateAccountPost1,
  reactivateAccountPost2,
  singleUserProfilePost1,
  singleUserProfilePost2,
  deleteAccountPost1,
  deleteAccountPost2,
  publicProfilePost1,
  publicProfilePost2,
};
