/**
 * Partial environment config used throughout the backend app.
 * All values are read from `.env` files via dotenv and loaded into this shape.
 */
type EnvConfig = Partial<{
  backendUrl: string; // Base URL for the backend server (e.g. http://localhost)
  backendPort: string; // Port number backend listens on (e.g. 3000)
  backendMongoDbUri: string; // MongoDB connection string
  backendJwtSecretKey: string; // Secret key used for signing JWTs
  cookieName: string; // Name of the HTTP-only cookie used for JWTs
  cookieExpirationMinutes: number; // Expiration time for the JWT cookie in minutes

  passwordResetWindowMinutes: number;
  passwordResetRateLimit: number; // Rate limit for password reset requests
  passwordResetExpirationMinutes: number; // Expiration time for password reset codes
  emailVerificationExpirationMinutes: number; // Expiration time for email verification codes

  nodemailerHost: string; // SMTP host for sending emails
  nodemailerPort: number; // SMTP port for sending emails
  nodemailerUser: string; // SMTP user for authentication
  nodemailerPass: string; // SMTP password for authentication
  nodemailerEmailFrom: string; // Default "from" email address for sending emails

  enableSocketIo: boolean; // Whether to enable Socket.IO support
}>;

export type { EnvConfig };
