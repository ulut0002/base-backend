import { NextFunction, Request, Response } from "express";

const getSessionsPost1 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] GET /sessions pre-handler 1 executed");
  next();
};

const getSessionsPost2 = (req: Request, res: Response, next: NextFunction) => {
  console.log("[Middleware] GET /sessions pre-handler 2 executed");
  next();
};

const postLogoutOthersPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /logout-others pre-handler 1 executed");
  next();
};

const postLogoutOthersPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /logout-others pre-handler 2 executed");
  next();
};

const postEnable2FAPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /enable-2fa pre-handler 1 executed");
  next();
};

const postEnable2FAPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /enable-2fa pre-handler 2 executed");
  next();
};

const postDisable2FAPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /disable-2fa pre-handler 1 executed");
  next();
};

const postDisable2FAPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /disable-2fa pre-handler 2 executed");
  next();
};

const postVerify2FAPost1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /verify-2fa pre-handler 1 executed");
  next();
};

const postVerify2FAPost2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[Middleware] POST /verify-2fa pre-handler 2 executed");
  next();
};

export {
  getSessionsPost1,
  getSessionsPost2,
  postLogoutOthersPost1,
  postLogoutOthersPost2,
  postEnable2FAPost1,
  postEnable2FAPost2,
  postDisable2FAPost1,
  postDisable2FAPost2,
  postVerify2FAPost1,
  postVerify2FAPost2,
};
