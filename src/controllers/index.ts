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
} from "./auth.controller";

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
};
