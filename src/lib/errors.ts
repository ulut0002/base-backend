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

/**
 * Represents a single validation error.
 * 'field' is optional to allow general errors.
 */
type FieldError = { field?: string; message: string };

/**
 * Utility to collect validation errors across multiple fields.
 * This allows us to conditionally add errors based on logic,
 * and then send them all together in a consistent format.
 */
const createValidationErrorCollector = () => {
  const errors: FieldError[] = [];

  /**
   * Adds an error conditionally.
   * If `condition` is provided, this is treated as a field-level validation.
   * If not, the first param is treated as a general error message.
   */
  const add = (
    fieldOrMessage: string,
    condition?: any,
    maybeMessage?: string
  ) => {
    if (typeof condition !== "undefined") {
      // Field-level error
      if (!condition) {
        errors.push({
          field: fieldOrMessage,
          message: maybeMessage || "This field is required.",
        });
      }
    } else {
      // General/global error
      errors.push({ message: fieldOrMessage });
    }
  };

  /**
   * Checks if any errors have been collected.
   */
  const hasErrors = () => errors.length > 0;

  /**
   * Returns all collected errors.
   */
  const get = () => errors;

  return { add, hasErrors, get };
};

class ApiError extends Error {
  status: number;
  name: string;
  code: string;
  fieldErrors: FieldError[] = [];

  constructor(message: string, status = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    this.code = MessageCodes.API_ERROR; // Default code
    this.fieldErrors = [];
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found", code = ErrorCodes.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = "NotFoundError";
    this.code = code || ErrorCodes.NOT_FOUND;
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request", code = ErrorCodes.BAD_REQUEST) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = "BadRequestError";
    this.code = code || ErrorCodes.BAD_REQUEST;
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", code = ErrorCodes.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "UnauthorizedError";
    this.code = code || ErrorCodes.UNAUTHORIZED;
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", code = ErrorCodes.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = "ForbiddenError";
    this.code = code || ErrorCodes.FORBIDDEN;
  }
}

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  debug(error);

  if (error instanceof ApiError) {
    res.status(error.status).json({
      name: error.name || "API_ERROR",
      code: error.code || MessageCodes.API_ERROR,
      error: error.message,
      fieldErrors: error.fieldErrors.length > 0 ? error.fieldErrors : [],
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

export {
  createValidationErrorCollector,
  createErrorResponse,
  errorHandler,
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  createErrorIf,
};
