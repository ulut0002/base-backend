import { getApiInfo } from "./root.controller";
import {
  configureJwtStrategy,
  login,
  logout,
  me,
  register,
} from "./auth.controller";

export { getApiInfo };
export { register, login, configureJwtStrategy, logout, me };
