interface PasswordRequestResult {
  token: string;
  hash: string;
  userId: string;
  expiresAt: Date;
  expireInSeconds: number;
}

export type { PasswordRequestResult };
