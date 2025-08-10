import { getBackendUrl, loadConfig } from "./config";
import { connectToDatabase, disconnectFromDatabase } from "./db";
import {
  createErrorResponse,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
  IssueType,
  Issue,
  createIssue,
  CreateIssueParams,
} from "./errors";
import { configureApp } from "./express";
import { logger } from "./logger";
import { getMailProfile, getMailProfiles, setMailProfiles } from "./mailConfig";

export { createErrorResponse };
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
  CreateIssueParams,
  createIssue,
};

export { logger };
export { connectToDatabase, disconnectFromDatabase };
export { configureApp };
export { setMailProfiles, getMailProfiles, getMailProfile };
export type { Issue };
export { IssueType };
