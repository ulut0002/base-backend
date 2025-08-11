import { loadConfig } from "../config";

import { createIssue, IssueType, Issue } from "../errors";
import validator from "validator";
import { ErrorCodes } from "../constants";

const checkUsername = (username: string): Issue[] => {
  const config = loadConfig();

  const issues: Issue[] = [];
  if (config.userUsernameRequired) {
    if (!username) {
      issues.push(
        createIssue({
          code: ErrorCodes.MISSING_USERNAME,
        })
      );
    }

    if (
      username &&
      config.userUsernameMinLength &&
      username.length < config.userUsernameMinLength
    ) {
      issues.push(
        createIssue({
          code: ErrorCodes.USERNAME_TOO_SHORT,
          messages: {
            minLength: config.userUsernameMinLength,
          },
        })
      );

      if (
        username &&
        config.userUsernameMaxLength &&
        username.length > config.userUsernameMaxLength
      ) {
        issues.push(
          createIssue({
            code: ErrorCodes.USERNAME_TOO_LONG,
            messages: {
              maxLength: config.userUsernameMaxLength,
            },
          })
        );
      }
    }
  }
  return issues;
};

const checkEmail = (email: string): Issue[] => {
  const config = loadConfig();
  const issues: Issue[] = [];

  if (config.userEmailRequired) {
    if (!email) {
      issues.push(
        createIssue({
          code: ErrorCodes.MISSING_EMAIL,
        })
      );
    }
    if (email && !validator.isEmail(email)) {
      issues.push(
        createIssue({
          code: ErrorCodes.INVALID_EMAIL,
        })
      );
    }
  }

  return issues;
};

const checkPassword = (password: string): Issue[] => {
  const config = loadConfig();
  const issues: Issue[] = [];

  let checkMore: boolean = true;

  if (checkMore) {
    if (!password) {
      issues.push(
        createIssue({
          code: ErrorCodes.MISSING_PASSWORD,
        })
      );
      checkMore = false;
    }
  }

  if (checkMore) {
    if (password.length < config.passwordMinLength!) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_TOO_SHORT,
          messages: {
            minLength: config.passwordMinLength,
            currentLength: password.length.toString(),
          },
        })
      );
    }
  }

  if (checkMore) {
    if (password.length > config.passwordMaxLength!) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_TOO_LONG,
          messages: {
            maxLength: config.passwordMaxLength,
            currentLength: password.length,
          },
        })
      );
    }
  }

  if (checkMore) {
    if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_MISSING_UPPERCASE,
        })
      );
    }
  }

  if (checkMore) {
    if (config.passwordRequireLowercase && !/[a-z]/.test(password)) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_MISSING_LOWERCASE,
        })
      );
    }
  }

  if (checkMore) {
    if (config.passwordRequireNumbers && !/[0-9]/.test(password)) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_MISSING_NUMBER,
        })
      );
    }
  }

  if (checkMore) {
    if (
      config.passwordRequireSpecialChars &&
      config.passwordSpecialChars &&
      config.passwordSpecialCharsRegex &&
      !config.passwordSpecialCharsRegex.test(password)
    ) {
      issues.push(
        createIssue({
          code: ErrorCodes.PASSWORD_MISSING_SPECIAL_CHAR,
        })
      );
    }
  }

  return issues;
};
const checkAuthConfiguration = (): Issue[] => {
  const config = loadConfig();
  const issues: Issue[] = [];

  if (!config.backendJwtSecretKey) {
    issues.push(
      createIssue({
        code: ErrorCodes.MISSING_JWT_SECRET,
      })
    );
  }

  if (
    config.backendJwtSecretKey &&
    config.backendJwtSecretKey.trim().length < 16
  ) {
    issues.push(
      createIssue({
        code: ErrorCodes.JWT_SECRET_TOO_SHORT,
        type: IssueType.warning,
        messages: {
          minLength: 16,
          currentLength: config.backendJwtSecretKey.trim().length,
        },
      })
    );
  }

  if (!config.cookieExpirationMinutes) {
    issues.push(
      createIssue({
        code: ErrorCodes.MISSING_COOKIE_EXPIRATION,
      })
    );
  }

  if (!config.cookieName) {
    issues.push(
      createIssue({
        code: ErrorCodes.MISSING_COOKIE_NAME,
      })
    );
  }

  if (!config.userEmailRequired && !config.userUsernameRequired) {
    issues.push(
      createIssue({
        code: ErrorCodes.MISSING_EMAIL,
      })
    );
  }

  return issues;
};

const checkPasswordSetup = (): Issue[] => {
  const config = loadConfig();
  const issues: Issue[] = [];

  if (!config.passwordHashLength) {
    issues.push(
      createIssue({
        code: ErrorCodes.MISSING_PASSWORD_HASH_LENGTH,
      })
    );
  }

  return issues;
};

export {
  checkUsername,
  checkEmail,
  checkAuthConfiguration,
  checkPassword,
  checkPasswordSetup,
};
