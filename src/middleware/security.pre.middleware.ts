import { NextFunction, Request, Response } from "express";

const getSessionsPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] GET /sessions pre-handler 1 executed");
  next();
};

const getSessionsPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] GET /sessions pre-handler 2 executed");
  next();
};

const postLogoutOthersPre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /logout-others pre-handler 1 executed");
  next();
};

const postLogoutOthersPre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /logout-others pre-handler 2 executed");
  next();
};

const postEnable2FAPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] POST /enable-2fa pre-handler 1 executed");
  next();
};

const postEnable2FAPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] POST /enable-2fa pre-handler 2 executed");
  next();
};

const postDisable2FAPre1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /disable-2fa pre-handler 1 executed");
  next();
};

const postDisable2FAPre2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /disable-2fa pre-handler 2 executed");
  next();
};

const postVerify2FAPre1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] POST /verify-2fa pre-handler 1 executed");
  next();
};

const postVerify2FAPre2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] POST /verify-2fa pre-handler 2 executed");
  next();
};

export {
  getSessionsPre1,
  getSessionsPre2,
  postLogoutOthersPre1,
  postLogoutOthersPre2,
  postEnable2FAPre1,
  postEnable2FAPre2,
  postDisable2FAPre1,
  postDisable2FAPre2,
  postVerify2FAPre1,
  postVerify2FAPre2,
};
