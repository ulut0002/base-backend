import { SecurityMiddlewareMap } from "../types";
import {
  getSessionsPost1,
  getSessionsPost2,
  postDisable2FAPost1,
  postDisable2FAPost2,
  postEnable2FAPost1,
  postEnable2FAPost2,
  postLogoutOthersPost1,
  postLogoutOthersPost2,
  postVerify2FAPost1,
  postVerify2FAPost2,
} from "./security.post.middleware";

import {
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
} from "./security.pre.middleware";

// Pre-middlewares (before controller logic)
export const preSecurityMiddleware: SecurityMiddlewareMap = {
  getSessions: [getSessionsPre1, getSessionsPre2],
  postLogoutOthers: [postLogoutOthersPre1, postLogoutOthersPre2],
  postEnable2FA: [postEnable2FAPre1, postEnable2FAPre2],
  postDisable2FA: [postDisable2FAPre1, postDisable2FAPre2],
  postVerify2FA: [postVerify2FAPre1, postVerify2FAPre2],
};

// Post-middlewares (after controller logic)
export const postSecurityMiddleware: SecurityMiddlewareMap = {
  getSessions: [getSessionsPost1, getSessionsPost2], // Assuming you want to keep this for consistency
  postLogoutOthers: [postLogoutOthersPost1, postLogoutOthersPost2],
  postEnable2FA: [postEnable2FAPost1, postEnable2FAPost2],
  postDisable2FA: [postDisable2FAPost1, postDisable2FAPost2],
  postVerify2FA: [postVerify2FAPost1, postVerify2FAPost2],
};
