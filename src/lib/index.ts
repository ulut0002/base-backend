import { getBackendUrl, loadConfig } from "./config";
import { connectToDatabase, disconnectFromDatabase } from "./db";
import {
  createErrorResponse,
  messageCollector,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
  FieldIssue,
  FieldIssueType,
  issue,
} from "./errors";
import { configureApp } from "./express";
import {
  parseAcceptLanguage,
  resolveT,
  setGlobalT,
  getGlobalT,
} from "./i18Next";
import { logger } from "./logger";
import { getMailProfile, getMailProfiles, setMailProfiles } from "./mailConfig";

export {
  messageCollector as createValidationErrorCollector,
  createErrorResponse,
};
export {
  loadConfig,
  getBackendUrl,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
  issue,
};
export { logger };
export { connectToDatabase, disconnectFromDatabase };
export { configureApp };
export { setMailProfiles, getMailProfiles, getMailProfile };
export type { FieldIssue };
export { FieldIssueType };
export { parseAcceptLanguage, resolveT, setGlobalT, getGlobalT };
