interface ResetPasswordRequest {
  emailOrUsername: string;
  sendEmail?: boolean;
}

interface ResetPasswordResult {
  code: string;
  hash: string;
  userId: string;
  expiresAt: Date;
  expireInSeconds: number;
}

interface CreateVerificationRequest {
  email?: string;
  sendEmail?: boolean;
}

interface CreateVerificationResult {
  code?: string;
  hash?: string;
  userId?: string;
  expiresAt?: Date;
  expireInSeconds?: number;
  alreadyVerified?: boolean;
  verifiedAt?: Date;
  noNeedToVerify?: boolean;
  verificationStatus?: VerificationStatus;
}

type VerificationStatus =
  | "NEEDS_VERIFICATION"
  | "ALREADY_VERIFIED"
  | "NOT_REQUIRED";

export type {
  ResetPasswordResult,
  ResetPasswordRequest,
  CreateVerificationRequest,
  CreateVerificationResult,
  VerificationStatus,
};
