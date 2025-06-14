import {
  UserRegistrationDTO,
  NewUserInput,
  UserDocument,
  LinkedObject,
} from "./user.types";
import { NormalizeOptions } from "./email.types";
import {
  RegisterUserInput,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  UserRole,
  SessionData,
} from "./auth.types";

import { EnvConfig } from "./config.types";

import {
  ResetPasswordRequest,
  ResetPasswordResult,
  CreateVerificationRequest,
  CreateVerificationResult,
  VerificationStatus,
} from "./recovery.types";

export type { UserRegistrationDTO, NewUserInput, UserDocument, LinkedObject };
export type {
  RegisterUserInput,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  SessionData,
};

export { UserRole };

export type { NormalizeOptions };

export type {
  ResetPasswordRequest,
  ResetPasswordResult,
  CreateVerificationRequest,
  CreateVerificationResult,
  VerificationStatus,
};

export type { EnvConfig };
