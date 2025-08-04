import { RequestHandler } from "express";

interface AuthMiddlewareMap {
  login: RequestHandler[];
  register: RequestHandler[];
  me: RequestHandler[];
  logout: RequestHandler[];
  changePassword: RequestHandler[];
  refreshToken: RequestHandler[];
  status: RequestHandler[];
}

interface MeMiddlewareMap {
  profile: RequestHandler[];
  email: RequestHandler[];
  username: RequestHandler[];
  deactivate: RequestHandler[];
  reactivate: RequestHandler[];
  updateUserById: RequestHandler[];
  deleteUserById: RequestHandler[];
  publicProfile: RequestHandler[];
}

interface SecurityMiddlewareMap {
  getSessions: RequestHandler[];
  postLogoutOthers: RequestHandler[];
}

export type { AuthMiddlewareMap, MeMiddlewareMap, SecurityMiddlewareMap };
