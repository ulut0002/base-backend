import { getApiInfo } from "./root.controller";
import {
  configureJwtStrategy,
  login,
  logout,
  me,
  register,
  refreshToken,
  changePassword,
  checkAuthStatus,
  requestPasswordChange,
} from "./auth.controller";
import {
  profile,
  updateEmail,
  updateUsername,
  deactivateAccount,
  reactivateAccount,
  deleteAccount,
  patchUpdateAccount,
  fetchPublicProfile,
} from "./me.controller";
import {
  getSessions,
  postDisable2FA,
  postEnable2FA,
  postLogoutOthers,
  postVerify2FA,
} from "./security.controller";
import {
  postForgotPassword,
  postResendVerification,
  postResetPassword,
  postSendVerification,
  postVerifyAccount,
  postRequestPasswordReset,
} from "./recovery.controller";

export { getApiInfo };

export {
  register,
  login,
  configureJwtStrategy,
  logout,
  me,
  refreshToken,
  changePassword,
  checkAuthStatus,
  requestPasswordChange,
};

export {
  profile,
  updateEmail,
  updateUsername,
  deactivateAccount,
  reactivateAccount,
  deleteAccount,
  patchUpdateAccount,
  fetchPublicProfile,
};

export {
  getSessions,
  postLogoutOthers,
  postEnable2FA,
  postDisable2FA,
  postVerify2FA,
};

export {
  postForgotPassword,
  postResendVerification,
  postResetPassword,
  postSendVerification,
  postVerifyAccount,
  postRequestPasswordReset,
};
