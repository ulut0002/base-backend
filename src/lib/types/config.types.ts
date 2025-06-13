/**
 * Partial environment config used throughout the backend app.
 * All values are read from `.env` files via dotenv and loaded into this shape.
 */
type EnvConfig = Partial<{
  BACKEND_URL: string; // Base URL for the backend server (e.g. http://localhost)
  BACKEND_PORT: string; // Port number backend listens on (e.g. 3000)
  BACKEND_MONGODB_URI: string; // MongoDB connection string
  BACKEND_JWT_SECRET_KEY: string; // Secret key used for signing JWTs

  PASSWORD_RESET_WINDOW_MINUTES: number;
  PASSWORD_RESET_RATE_LIMIT: number; // Rate limit for password reset requests
  PASSWORD_RESET_EXPIRATION_MINUTES: number; // Expiration time for password reset codes

  NODEMAILER_HOST: string; // SMTP host for sending emails
  NODEMAILER_PORT: number; // SMTP port for sending emails
  NODEMAILER_USER: string; // SMTP user for authentication
  NODEMAILER_PASS: string; // SMTP password for authentication
  NODEMAILER_EMAIL_FROM: string; // Default "from" email address for sending emails

  ENABLE_SOCKET_IO: boolean; // Whether to enable Socket.IO support
}>;
