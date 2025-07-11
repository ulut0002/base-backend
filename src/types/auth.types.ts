// src/types/auth.types.ts

import { FieldIssue } from "../lib";
import { TypeOrNull } from "./generic.types";

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
  VerificationCodeType,
  VerificationCodeStatus,
  SessionData,
};
