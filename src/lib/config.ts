import { isTrue } from "./utils";

let _cachedConfig: EnvConfig | null = null;

/**
 * Returns a shallow copy of the loaded environment configuration.
 */
function loadConfig(): EnvConfig {
  // if (_cachedConfig) return _cachedConfig;

  _cachedConfig = {
    BACKEND_URL: process.env.BACKEND_URL || "",
    BACKEND_PORT: process.env.BACKEND_PORT || "",
    BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
    BACKEND_JWT_SECRET_KEY: process.env.BACKEND_JWT_SECRET_KEY || "",
    PASSWORD_RESET_WINDOW_MINUTES: parseInt(
      String(process.env.PASSWORD_RESET_WINDOW_MINUTES)
    ),
    PASSWORD_RESET_RATE_LIMIT: parseInt(
      String(process.env.PASSWORD_RESET_RATE_LIMIT)
    ),
    PASSWORD_RESET_EXPIRATION_MINUTES: parseInt(
      String(process.env.PASSWORD_RESET_EXPIRATION_MINUTES)
    ),
    NODEMAILER_HOST: process.env.NODEMAILER_HOST,
    NODEMAILER_PORT: parseInt(String(process.env.NODEMAILER_PORT)),
    NODEMAILER_USER: process.env.NODEMAILER_USER, // SMTP user for authentication
    NODEMAILER_PASS: process.env.NODEMAILER_PASS, //
    NODEMAILER_EMAIL_FROM: process.env.NODEMAILER_EMAIL_FROM,

    ENABLE_SOCKET_IO: isTrue(process.env.ENABLE_SOCKET_IO),
  };
  return _cachedConfig;
}

/**
 * Constructs the backend URL using the host and port from environment config.
 * Returns undefined if either value is missing.
 */
function getBackendUrl(): string | undefined {
  const config = loadConfig();

  console.log("Loaded config:", config);

  const backendUrl = config.BACKEND_URL;
  const backendPort = config.BACKEND_PORT;

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
