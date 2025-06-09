const listActiveSessions = async (userId: string): Promise<string[]> => {
  // Replace with actual session store lookup
  return ["current-session-id", "session-id-2"];
};

const logoutOtherSessions = async (
  userId: string,
  currentSessionId: string
): Promise<void> => {
  // Invalidate all sessions for userId except currentSessionId
};

const enableTwoFactorAuth = async (
  userId: string,
  secret: string
): Promise<{ qrCodeUrl: string }> => {
  // Store secret, return QR Code URL or base64
  return { qrCodeUrl: "otpauth://totp/..." };
};

const disableTwoFactorAuth = async (userId: string): Promise<void> => {
  // Remove 2FA secret/token for userId
};

const verifyTwoFactorCode = async (
  userId: string,
  code: string
): Promise<boolean> => {
  // Compare code with stored 2FA secret
  return true; // or false
};

export {
  listActiveSessions,
  logoutOtherSessions,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorCode,
};
