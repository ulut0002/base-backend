import { ErrorCodes } from "../constants";
import { ApiError, BadRequestError, createErrorIf } from "../errors";

const checkUsername = (username: string) => {
  createErrorIf({
    fieldName: "username",
    condition: username,
    ErrorType: BadRequestError,
    details: "Username is required",
    code: ErrorCodes.MISSING_USERNAME,
  });

  createErrorIf({
    fieldName: "username",
    condition: username.length >= 3,
    ErrorType: BadRequestError,
    details: "Username must be at least 3 characters long",
    code: ErrorCodes.USERNAME_TOO_SHORT,
  });

  createErrorIf({
    fieldName: "username",
    condition: username.length >= 50,
    ErrorType: BadRequestError,
    details: "Username must be less than 50 characters long",
    code: ErrorCodes.USERNAME_TOO_LONG,
  });
};

const checkEmail = (email: string) => {
  createErrorIf({
    fieldName: "email",
    condition: email,
    ErrorType: BadRequestError,
    details: "Email is required",
    code: ErrorCodes.MISSING_EMAIL,
  });
};

const checkJwtSecretKey = (jwtSecretKey: string) => {
  createErrorIf({
    fieldName: "securityKey",
    condition: jwtSecretKey,
    ErrorType: ApiError,
    details: "Security key is missing",
    code: ErrorCodes.MISSING_SECURITY_KEY,
  });

  createErrorIf({
    fieldName: "securityKey",
    condition: jwtSecretKey.trim().length > 5,
    ErrorType: ApiError,
    details: "Security key is too short",
    code: ErrorCodes.SECURITY_KEY_TOO_SHORT,
  });
};

export { checkUsername, checkEmail, checkJwtSecretKey };
