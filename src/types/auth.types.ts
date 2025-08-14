// src/types/auth.types.ts

import { Issue } from "../lib";
import { TypeOrNull } from "./generic.types";
import { UserDocument } from "./user.types";

interface RegisterUserInput {
  username: string;
  email: string;
  normalizedEmail?: string;
  password: string;
  jwtSecretKey: string;
  passwordHashLength: number;
}

interface RegisterUserResult {
  token?: TypeOrNull<string>;
  userObject?: any;
  issues?: Issue[];
}

interface RegisterUserResponseData {
  userId: TypeOrNull<string>;
  success: boolean;
  registrationToken: TypeOrNull<string>;
}

interface LoginUserInput {
  usernameOrEmail: string;
  password: string;
  jwtSecretKey: string;
}

interface LoginUserResult {
  token?: TypeOrNull<string>;
  userObject?: any;
  issues?: Issue[];
}

interface ChangePasswordResult {
  userObject?: any;
  issues?: Issue[];
}

type MeResponse = {
  user: SafeUser;
};

type SafeUser = Pick<UserDocument, "_id" | "username" | "email">;

type VerificationCodeType =
  | "PASSWORD_RESET"
  | "EMAIL_VERIFICATION"
  | "TWO_FACTOR"
  | "INVITE";

type VerificationCodeStatus = "PENDING" | "VERIFIED" | "EXPIRED";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

type SessionData = {
  sub: string; // User ID
  username: string; // Username
  role: string; // User role
};

type PasswordChangeRequestRequest = {
  userId: TypeOrNull<string>;
};

type PasswordChangeRequestResult = {
  success: boolean;
  issues?: Issue[];
};

export type {
  RegisterUserInput,
  RegisterUserResult,
  LoginUserInput,
  LoginUserResult,
  VerificationCodeType,
  VerificationCodeStatus,
  ChangePasswordResult,
  MeResponse,
  SessionData,
  RegisterUserResponseData,
  PasswordChangeRequestRequest,
  PasswordChangeRequestResult,
};
