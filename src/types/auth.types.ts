// src/types/auth.types.ts

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  jwtSecretKey: string;
}

interface LoginUserInput {
  username: string;
  password: string;
  jwtSecretKey: string;
}

type VerificationCodeType =
  | "PASSWORD_RESET"
  | "EMAIL_VERIFICATION"
  | "TWO_FACTOR"
  | "INVITE";

type VerificationCodeStatus = "PENDING" | "VERIFIED" | "EXPIRED";

export type {
  RegisterUserInput,
  LoginUserInput,
  VerificationCodeType,
  VerificationCodeStatus,
};
