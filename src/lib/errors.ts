import c from "config";
import { ErrorCodes, HTTP_STATUS, MessageCodes } from "./constants";
import createDebug from "debug";
import { Request, Response, NextFunction } from "express";

const debug = createDebug("app:errorHandler");

/**
 * Represents a detailed error for a specific field (optional).
 * If 'field' is not provided, it's considered a global error.
 */
interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Parameters expected when generating a standardized error response.
 */
interface ErrorResponseParams {
  code: string; // A machine-readable error code
  message: string; // A human-readable error message
  details?: ErrorDetail[]; // Optional list of field-level or general errors
  showDetails?: boolean; // Flag to control whether to include 'details' in the response
}

/**
 * Builds a standardized error response object.
 * Used across the backend to ensure consistency when sending errors.
 */
const createErrorResponse = ({
  code = MessageCodes.VALIDATION_ERROR,
  message,
  details = [],
  showDetails = true,
}: ErrorResponseParams) => {
  const error: Record<string, any> = {
    code,
    message,
  };

  // Only include detailed errors if enabled and present
  if (showDetails && details.length > 0) {
    error.details = details;
  }

  return {
    status: "error",
    error: {
      code, // machine-readable
      message, // user-friendly
      ...(showDetails && details.length > 0 ? { details } : {}),
    },
  };
};

enum FieldIssueType {
  error = "error",
  warning = "warning",
  message = "info",
}

type Issue = {
  type?: FieldIssueType;
  code?: ErrorCodes;
  errorType?: ApiError;
  messages?: Record<string, string | number | boolean | null | undefined>; // key = field name, value = message
};

/**
 * Represents a single validation error.
 * 'field' is optional to allow general errors.
 */
type FieldIssue = {
  type?: FieldIssueType;
  code?: ErrorCodes;
  field?: string;
  message?: string;
  errorType?: ApiError;
};

const messageCollector = () => {
  const errors: FieldIssue[] = [];
  const warnings: FieldIssue[] = [];
  const infos: FieldIssue[] = [];

  const createAdder =
    (targetList: FieldIssue[], type: FieldIssueType) =>
    (field: string, condition?: any, message?: string): void => {
      if (typeof condition !== "undefined") {
        if (!condition) {
          targetList.push({
            type,
            field: field,
            message: message,
          });
        }
      } else {
        // General/global issue
        targetList.push({
          type,
          message: field,
        });
      }
    };

  const addError = createAdder(errors, FieldIssueType.error);
  const addWarning = createAdder(warnings, FieldIssueType.warning);
  const addInfo = createAdder(infos, FieldIssueType.message);

  const hasErrors = () => errors.length > 0;
  const getErrors = () => errors;
  const hasWarnings = () => warnings.length > 0;
  const getWarnings = () => warnings;
  const hasInfos = () => infos.length > 0;
  const getInfos = () => infos;

  return {
    addError,
    addWarning,
    addInfo,
    hasErrors,
    getErrors,
    hasWarnings,
    getWarnings,
    hasInfos,
    getInfos,
  };
};

class ApiError extends Error {
  status: number;
  name: string;
  internalCode?: string;
  fieldIssues: FieldIssue[] = [];

  constructor(message: string, status = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    this.internalCode = MessageCodes.API_ERROR; // Default code
    this.fieldIssues = [];
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }

  withIssues(issues: FieldIssue[]): this {
    this.fieldIssues = [...this.fieldIssues, ...issues];
    return this;
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found", code = ErrorCodes.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = "NotFoundError";
    this.internalCode = code || ErrorCodes.NOT_FOUND;
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request", code = ErrorCodes.BAD_REQUEST) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = "BadRequestError";
    this.internalCode = code || ErrorCodes.BAD_REQUEST;
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", code = ErrorCodes.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "UnauthorizedError";
    this.internalCode = code || ErrorCodes.UNAUTHORIZED;
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", code = ErrorCodes.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = "ForbiddenError";
    this.internalCode = code || ErrorCodes.FORBIDDEN;
  }
}

class InternalServerError extends ApiError {
  constructor(
    message = "Internal Server Error",
    code = ErrorCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    this.name = "InternalServiceError";
    this.internalCode = code || ErrorCodes.INTERNAL_SERVER_ERROR;
  }
}

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    const issues = error.fieldIssues || [];
    const errors = issues.filter(
      (issue) => issue.type === FieldIssueType.error
    );
    const warnings = issues.filter(
      (issue) => issue.type === FieldIssueType.warning
    );
    const messages = issues.filter(
      (issue) => issue.type === FieldIssueType.message
    );

    res.status(error.status).json({
      name: error.name || "API_ERROR",
      internalCode: error.internalCode || MessageCodes.API_ERROR,
      message: error.message,
      issues: req.xMeta!.getAllIssues(),
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: "Something went wrong",
  });
};

const createErrorIf = <T extends ApiError>({
  fieldName,
  condition,
  details,
  code,
  ErrorType = BadRequestError as unknown as new (
    message: string,
    code?: any
  ) => T,
}: {
  fieldName: string;
  condition: any;
  details?: string;
  code?: string | ErrorCodes; // allow both if needed
  ErrorType?: new (message: string, code?: any) => T;
}): void => {
  if (!condition) {
    const baseMessage = `Invalid value for field: ${fieldName}.`;
    const fullMessage = `${baseMessage} ${details || ""}`.trim();
    const error = new ErrorType(fullMessage, code);
    throw error;
  }
};

const issue = (
  field: string,
  message: string,
  type?: FieldIssueType
): FieldIssue => ({
  type: type || FieldIssueType.error,
  field,
  message,
});

type CreateIssueParams = {
  code?: ErrorCodes;
  messages?: Record<string, string | number | boolean | null | undefined>;
  type?: FieldIssueType;
};

const createIssue = (params: CreateIssueParams): Issue => ({
  type: params.type || FieldIssueType.error,
  code: params.code,
  messages: params.messages,
});

export {
  messageCollector,
  createErrorResponse,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
  FieldIssueType,
  issue,
  createIssue,
};

export type { FieldIssue, Issue, CreateIssueParams };
