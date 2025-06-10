// src/types/auth.types.ts

interface RegisterUserInput {
  username: string;
  email: string;
  normalizedEmail?: string;
  password: string;
  jwtSecretKey: string;
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
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
  SessionData,
};
