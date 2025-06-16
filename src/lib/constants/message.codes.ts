/**
 * Machine-readable error codes used across API responses.
 * These codes provide consistent identifiers for error types
 * that can be used by frontends or logging systems.
 */
export enum MessageCodes {
  /**
   * Generic validation failure (e.g. missing/invalid fields)
   */
  VALIDATION_ERROR = "VALIDATION_ERROR",

  /**
   * Required field is missing from input
   */
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  /**
   * JWT secret key is not configured or invalid
   */
  MISSING_SECURITY_KEY = "MISSING_SECURITY_KEY",

  /**
   * A specific field is required but was not provided
   */
  REQUIRED_FIELD = "REQUIRED_FIELD",

  /**
   * Email format is invalid
   */
  INVALID_EMAIL = "INVALID_EMAIL",

  /**
   * Password doesn't meet security rules
   */
  INVALID_PASSWORD = "INVALID_PASSWORD",

  /**
   * A user with the same username or email already exists
   */
  EXISTING_USER = "EXISTING_USER",

  /**
   * Authentication failed due to invalid credentials
   */
  AUTH_FAILED = "AUTH_FAILED",

  /**
   * Generic server-side error
   */
  SERVER_ERROR = "SERVER_ERROR",

  /**
   * Requested resource was not found
   */
  NOT_FOUND = "NOT_FOUND",

  /**
   * User is not authorized to perform this action
   */
  UNAUTHORIZED = "UNAUTHORIZED",

  API_ERROR = "API_ERROR",
}

export enum ErrorCodes {
  API_ERROR = "API_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",

  EXISTING_USER_FOUND = "EXISTING_USER_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_MISSING_PASSWORD = "USER_MISSING_PASSWORD",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  PASSWORD_NOT_MATCHING = "PASSWORD_NOT_MATCHING",
  INVALID_CONFIGURATION = "INVALID_CONFIGURATION",

  // username
  USERNAME_TOO_SHORT = "USERNAME_TOO_SHORT",
  USERNAME_TOO_LONG = "USERNAME_TOO_LONG",
  MISSING_USERNAME = "MISSING_USERNAME",
  MISSING_EMAIL = "MISSING_EMAIL",
  MISSING_PASSWORD = "MISSING_PASSWORD",
  MISSING_PASSWORD_CONFIRMATION = "MISSING_PASSWORD_CONFIRMATION",

  MISSING_SECURITY_KEY = "MISSING_SECURITY_KEY",
  SECURITY_KEY_TOO_SHORT = "SECURITY_KEY_TOO_SHORT",
  MISSING_COOKIE_EXPIRATION = "MISSING_COOKIE_EXPIRATION",
  MISSING_TOKEN = "MISSING_TOKEN",
  MISSING_HASH = "MISSING_HASH",
  MISSING_USER_ID = "MISSING_USER_ID",

  VERIFICATION_CODE_NOT_FOUND = "VERIFICATION_CODE_NOT_FOUND",
  VERIFICATION_CODE_EXPIRED = "VERIFICATION_CODE_EXPIRED",

  USER_ALREADY_VERIFIED = "USER_ALREADY_VERIFIED",
}
