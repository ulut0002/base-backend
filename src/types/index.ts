// Auth Types
import {
  ChangePasswordResult,
  LoginUserInput,
  LoginUserResult,
  MeResponse,
  RegisterUserInput,
  RegisterUserResult,
  SessionData,
  UserRole,
  VerificationCodeStatus,
  VerificationCodeType,
  RegisterUserResponseData,
  PasswordChangeRequestRequest,
  PasswordChangeRequestResult,
} from "./auth.types";

// Config Types
import { EnvConfig } from "./config.types";

// Email Types
import { MailProfile, MailProfiles, NormalizeOptions } from "./email.types";

// Express Types
import { addIssuesToRequest } from "./express.types";

// Generic Types
import { StringOrBlank, TypeOrNull } from "./generic.types";

// Middleware Types
import {
  AuthMiddlewareMap,
  MeMiddlewareMap,
  SecurityMiddlewareMap,
} from "./middleware.types";

// Recovery Types
import {
  CreateVerificationRequest,
  CreateVerificationResult,
  ResetPasswordRequest,
  ResetPasswordResult,
  VerificationStatus,
} from "./recovery.types";

// User Types
import {
  LinkedObject,
  NewUserInput,
  UserDocument,
  UserRegistrationDTO,
} from "./user.types";

// Auth Types Exports
export type {
  ChangePasswordResult,
  LoginUserInput,
  LoginUserResult,
  MeResponse,
  RegisterUserInput,
  RegisterUserResult as RegisterUserServiceResponse,
  SessionData,
  VerificationCodeStatus,
  VerificationCodeType,
  RegisterUserResponseData,
  PasswordChangeRequestRequest,
  PasswordChangeRequestResult,
};

// Auth Types Named Export
export { UserRole };

// Config Types Export
export type { EnvConfig };

// Email Types Exports
export type { MailProfile, MailProfiles, NormalizeOptions };

// Recovery Types Exports
export type {
  CreateVerificationRequest,
  CreateVerificationResult,
  ResetPasswordRequest,
  ResetPasswordResult,
  VerificationStatus,
};

// Middleware Types Exports
export type { AuthMiddlewareMap, MeMiddlewareMap, SecurityMiddlewareMap };

// Generic Types Exports
export type { StringOrBlank, TypeOrNull };

// Express Types Export
export { addIssuesToRequest };

// User Types Exports
export type { LinkedObject, NewUserInput, UserDocument, UserRegistrationDTO };
