import { getBackendUrl, loadConfig } from "./config";
import { connectToDatabase, disconnectFromDatabase } from "./db";
import {
  createErrorResponse,
  createValidationErrorCollector,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
} from "./errors";
import { configureApp } from "./express";
import { logger } from "./logger";

export { createValidationErrorCollector, createErrorResponse };
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
};
export { logger };
export { connectToDatabase, disconnectFromDatabase };
export { configureApp };
