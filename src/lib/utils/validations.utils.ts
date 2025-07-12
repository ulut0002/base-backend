import { loadConfig } from "../config";
import { ErrorCodes } from "../constants";
import {
  ApiError,
  createErrorIf,
  FieldIssue,
  FieldIssueType,
  issue,
} from "../errors";
import validator from "validator";

const checkUsername = (username: string): FieldIssue[] => {
  const config = loadConfig();

  const issues: FieldIssue[] = [];
  if (config.userUsernameRequired) {
    if (!username) {
      issues.push(issue("username", "Username is required"));
    }

    if (username && config.userUsernameMinLength) {
      if (username.length < config.userUsernameMinLength) {
        issues.push(
          issue(
            "username",
            `Username must be at least ${config.userUsernameMinLength} characters long`
          )
        );
      }

      if (
        username &&
        config.userUsernameMaxLength &&
        username.length > config.userUsernameMaxLength
      ) {
        issues.push(
          issue(
            "username",
            `Username must be less than ${config.userUsernameMaxLength} characters long`
          )
        );
      }
    }
  }
  return issues;
};

const checkEmail = (email: string): FieldIssue[] => {
  const config = loadConfig();
  const issues: FieldIssue[] = [];

  if (config.userEmailRequired) {
    if (!email) {
      issues.push(issue("email", "Email is required"));
    }
    if (email && !validator.isEmail(email)) {
      issues.push(issue("email", `Invalid email format ${email}`));
    }
  }

  return issues;
};

const checkAuthConfiguration = (jwtSecretKey: string): FieldIssue[] => {
  const config = loadConfig();
  const issues: FieldIssue[] = [];

  if (!jwtSecretKey) {
    issues.push(issue("Jwt_Key", "JWT secret key is required. Contact admin."));
  }

  if (jwtSecretKey && jwtSecretKey.trim().length < 16) {
    issues.push(
      issue("Jwt_Key", "JWT secret key is too short", FieldIssueType.warning)
    );
  }

  if (!config.cookieExpirationMinutes) {
    issues.push(
      issue("Cookie_Expiration", "Cookie expiration time is not set")
    );
  }

  if (!config.cookieName) {
    issues.push(issue("Cookie_Name", "Cookie name is not set"));
  }

  return issues;
};

export { checkUsername, checkEmail, checkAuthConfiguration };
