import "express";

declare module "express" {
  interface Request {
    authToken?: string;
    authUser?: any; // optional: attach user data if needed
  }
}
