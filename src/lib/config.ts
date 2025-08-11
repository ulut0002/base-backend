import { EnvConfig } from "../types";
import { getRequiredEnv, isTrue, parseNumberEnv } from "./utils";

let _cachedConfig: EnvConfig | null = null;

/**
 * Returns a shallow copy of the loaded environment configuration.
 */
function loadConfig(): EnvConfig {
  // if (_cachedConfig) return _cachedConfig;

  function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  _cachedConfig = {
    // Required environment variables
    backendUrl: getRequiredEnv("URL"),

    backendPort: getRequiredEnv("PORT"),
    backendMongoDbUri: getRequiredEnv("MONGODB_URI"),
    backendJwtSecretKey: getRequiredEnv("JWT_SECRET_KEY"),

    registerEnabled: isTrue(process.env.REGISTER_ENABLED),
    userUsernameRequired: isTrue(process.env.USER_USERNAME_REQUIRED),
    userEmailRequired: isTrue(process.env.USER_EMAIL_REQUIRED),
    userUsernameMinLength: parseNumberEnv("USER_USERNAME_MIN_LENGTH"),
    userUsernameMaxLength: parseNumberEnv("USER_USERNAME_MAX_LENGTH"),
    useNormalizedEmails: isTrue(process.env.NORMALIZE_EMAILS),

    // Optional environment variables with defaults

    // Cookie settings
    cookieName: process.env.COOKIE_NAME || "token",
    cookieExpirationMinutes: parseNumberEnv("COOKIE_EXPIRATION_MINUTES") || 60,

    // Password settings
    passwordMinLength: parseNumberEnv("PASSWORD_MIN_LENGTH", 4),
    passwordMaxLength: parseNumberEnv("PASSWORD_MAX_LENGTH", 64),
    passwordHashLength: parseNumberEnv("PASSWORD_HASH_LENGTH", 10),
    passwordRequireUppercase: isTrue(process.env.PASSWORD_REQUIRE_UPPERCASE),
    passwordRequireLowercase: isTrue(process.env.PASSWORD_REQUIRE_LOWERCASE),
    passwordRequireNumbers: isTrue(process.env.PASSWORD_REQUIRE_NUMBERS),
    passwordRequireSpecialChars: isTrue(
      process.env.PASSWORD_REQUIRE_SPECIAL_CHARS
    ),
    passwordSpecialChars: process.env.PASSWORD_SPECIAL_CHARS || "",

    // Password reset settings
    passwordResetWindowMinutes: parseNumberEnv("PASSWORD_RESET_WINDOW_MINUTES"),
    passwordResetRateLimit: parseNumberEnv("PASSWORD_RESET_RATE_LIMIT"),
    passwordResetExpirationMinutes: parseNumberEnv(
      "PASSWORD_RESET_EXPIRATION_MINUTES",
      10
    ),
    emailVerificationExpirationMinutes: parseNumberEnv(
      "EMAIL_VERIFICATION_EXPIRATION_MINUTES",
      0
    ),

    // Nodemailer settings
    nodemailerHost: process.env.NODEMAILER_HOST,
    nodemailerPort: parseNumberEnv("NODEMAILER_PORT"),
    nodemailerUser: process.env.NODEMAILER_USER, // SMTP user for authentication
    nodemailerPass: process.env.NODEMAILER_PASS, // SMTP password for authentication
    nodemailerEmailFrom: process.env.NODEMAILER_EMAIL_FROM, // Default "from" email address

    enableSocketIo: isTrue(process.env.ENABLE_SOCKET_IO),
    supportLanguages: process.env.SUPPORT_LANGUAGES
      ? process.env.SUPPORT_LANGUAGES.split(",").map((lang) => lang.trim())
      : ["en"],
  };

  if (
    _cachedConfig.passwordRequireSpecialChars &&
    _cachedConfig.passwordSpecialChars
  ) {
    _cachedConfig.passwordSpecialCharsRegex = new RegExp(
      new RegExp(`[${escapeRegExp(_cachedConfig.passwordSpecialChars)}]`, "u")
    );
  }
  return _cachedConfig;
}

/**
 * Constructs the backend URL using the host and port from environment config.
 * Returns undefined if either value is missing.
 */
function getBackendUrl(): string | undefined {
  const config = loadConfig();

  const backendUrl = config.backendUrl;
  const backendPort = config.backendPort;

  if (!backendUrl || !backendPort) {
    return undefined;
  }

  return createUrl(backendUrl, backendPort);
}

/**
 * Helper function to join host and port into a full URL string.
 * Returns an empty string if host is not defined.
 */
function createUrl(host: string, port?: string): string {
  if (!host) {
    return "";
  }
  return port ? `${host}:${port}` : host;
}

export { loadConfig, getBackendUrl };
