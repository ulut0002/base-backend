import { UserRegistrationDTO, NewUserInput, UserDocument } from "./user.types";
import { NormalizeOptions } from "./email.types";
import {
  RegisterUserInput,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  UserRole,
  SessionData,
} from "./auth.types";

export type { UserRegistrationDTO, NewUserInput, UserDocument };
export type {
  RegisterUserInput,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  SessionData,
};

export { UserRole };

export type { NormalizeOptions };
