// src/types/auth.types.ts

import { Issue } from "../lib";
import { TypeOrNull } from "./generic.types";
import { UserDocument } from "./user.types";

//register
interface RegisterUserUserRequest {
  username: string;
  email: string;
  normalizedEmail?: string;
  password: string;
  jwtSecretKey: string;
  passwordHashLength: number;
}

interface RegisterUser_ServiceResponse {
  token?: TypeOrNull<string>;
  userObject?: any;
  issues?: Issue[];
}

interface RegisterUser_Response {
  userId: TypeOrNull<string>;
  success: boolean;
  registrationToken: TypeOrNull<string>;
}

// Login
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
  RegisterUserUserRequest,
  RegisterUser_ServiceResponse,
  LoginUserInput,
  LoginUserResult,
  VerificationCodeType,
  VerificationCodeStatus,
  ChangePasswordResult,
  MeResponse,
  SessionData,
  RegisterUser_Response,
  PasswordChangeRequestRequest,
  PasswordChangeRequestResult,
};
