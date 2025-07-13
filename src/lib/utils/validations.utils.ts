import { getFixedT, TFunction } from "i18next";
import { loadConfig } from "../config";

import { FieldIssue, FieldIssueType, issue } from "../errors";
import validator from "validator";

const checkUsername = (username: string, t?: TFunction): FieldIssue[] => {
  const config = loadConfig();

  t = t || getFixedT("en");

  const issues: FieldIssue[] = [];
  if (config.userUsernameRequired) {
    if (!username) {
      issues.push(
        issue(t("username"), t("required", { field: t("username") }))
      );
    }

    if (username && config.userUsernameMinLength) {
      if (username.length < config.userUsernameMinLength) {
        issues.push(
          issue(
            t("username"),
            t("minLength", {
              field: t("username"),
              min: config.userUsernameMinLength,
            })
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
            t("username"),
            t("maxLength", {
              field: t("username"),
              min: config.userUsernameMaxLength,
            })
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

const checkAuthConfiguration = (): FieldIssue[] => {
  const config = loadConfig();
  const issues: FieldIssue[] = [];

  if (!config.backendJwtSecretKey) {
    issues.push(issue("Jwt_Key", "JWT secret key is required. Contact admin."));
  }

  if (
    config.backendJwtSecretKey &&
    config.backendJwtSecretKey.trim().length < 16
  ) {
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

  if (!config.userEmailRequired && !config.userUsernameRequired) {
    issues.push(
      issue(
        "Registration_Configuration",
        "At least one of email or username must be required for registration"
      )
    );
  }

  return issues;
};

export { checkUsername, checkEmail, checkAuthConfiguration };
