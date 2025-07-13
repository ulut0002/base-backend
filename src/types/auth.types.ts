// src/types/auth.types.ts

import { FieldIssue } from "../lib";
import { TypeOrNull } from "./generic.types";
import { UserDocument } from "./user.types";

interface RegisterUserInput {
  username: string;
  email: string;
  normalizedEmail?: string;
  password: string;
  jwtSecretKey: string;
}

interface RegisterUserResult {
  token?: TypeOrNull<string>;
  userObject?: any;
  issues?: FieldIssue[];
}

interface LoginUserInput {
  usernameOrEmail: string;
  password: string;
  jwtSecretKey: string;
}

interface LoginUserResult {
  token?: TypeOrNull<string>;
  userObject?: any;
  issues?: FieldIssue[];
}

interface ChangePasswordResult {
  userObject?: any;
  issues?: FieldIssue[];
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
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
}

type SessionData = {
  sub: string; // User ID
  username: string; // Username
  role: string; // User role
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
};
