import {
  UserRegistrationDTO,
  NewUserInput,
  UserDocument,
  LinkedObject,
} from "./user.types";
import { NormalizeOptions, MailProfiles, MailProfile } from "./email.types";
import {
  RegisterUserInput,
  RegisterUserResult,
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

import {
  AuthMiddlewareMap,
  MeMiddlewareMap,
  SecurityMiddlewareMap,
} from "./middleware.types";

import { StringOrBlank, TypeOrNull } from "./generic.types";

export type { UserRegistrationDTO, NewUserInput, UserDocument, LinkedObject };
export type {
  RegisterUserInput,
  RegisterUserResult,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  SessionData,
};

export { UserRole };

export type { NormalizeOptions, MailProfiles, MailProfile };

export type {
  ResetPasswordRequest,
  ResetPasswordResult,
  CreateVerificationRequest,
  CreateVerificationResult,
  VerificationStatus,
};

export type { EnvConfig };

export type { AuthMiddlewareMap, MeMiddlewareMap, SecurityMiddlewareMap };

export type { StringOrBlank, TypeOrNull };
