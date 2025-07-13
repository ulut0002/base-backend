import {
  changePasswordPre1,
  changePasswordPre2,
  loginPre1,
  loginPre2,
  logoutPre1,
  logoutPre2,
  mePre1,
  mePre2,
  refreshTokenPre1,
  refreshTokenPre2,
  registerPre1,
  registerPre2,
  statusPre1,
  statusPre2,
} from "./auth.pre.middleware";

import {
  changePasswordPost1,
  changePasswordPost2,
  loginPost1,
  loginPost2,
  logoutPost1,
  logoutPost2,
  mePost1,
  mePost2,
  refreshTokenPost1,
  refreshTokenPost2,
  registerPost1,
  registerPost2,
  statusPost1,
  statusPost2,
} from "./auth.post.middleware";
import { AuthMiddlewareMap } from "../types";
import {
  authStatusComplete,
  changePasswordComplete,
  loginComplete,
  logoutComplete,
  meComplete,
  refreshTokenComplete,
  registerComplete,
} from "./auth.complete.middleware";

// Pre-middlewares (before controller logic)
export const preAuthMiddleware: AuthMiddlewareMap = {
  login: [loginPre1, loginPre2],
  register: [registerPre1, registerPre2],
  me: [mePre1, mePre2],
  logout: [logoutPre1, logoutPre2],
  changePassword: [changePasswordPre1, changePasswordPre2],
  refreshToken: [refreshTokenPre1, refreshTokenPre2],
  status: [statusPre1, statusPre2],
};

// Post-middlewares (after controller logic)
export const postAuthMiddleware: AuthMiddlewareMap = {
  login: [loginPost1, loginPost2],
  register: [registerPost1, registerPost2],
  me: [mePost1, mePost2],
  logout: [logoutPost1, logoutPost2],
  changePassword: [changePasswordPost1, changePasswordPost2],
  refreshToken: [refreshTokenPost1, refreshTokenPost2],
  status: [statusPost1, statusPost2],
};

export const completeAuthMiddleware: AuthMiddlewareMap = {
  login: [loginComplete],
  register: [registerComplete],
  me: [meComplete],
  logout: [logoutComplete],
  changePassword: [changePasswordComplete],
  refreshToken: [refreshTokenComplete],
  status: [authStatusComplete],
};
