import { getFixedT, TFunction } from "i18next";
import { loadConfig } from "../config";

import { FieldIssue, FieldIssueType, issue } from "../errors";
import validator from "validator";
import { getGlobalT } from "../i18Next";

const checkUsername = (username: string): FieldIssue[] => {
  const config = loadConfig();
  const t = getGlobalT();

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
  const t = getGlobalT();

  if (config.userEmailRequired) {
    if (!email) {
      issues.push(issue(t("email"), t("required", { field: t("email") })));
    }
    if (email && !validator.isEmail(email)) {
      issues.push(issue(t("email"), t("invalid", { field: t("email") })));
    }
  }

  return issues;
};

const checkAuthConfiguration = (): FieldIssue[] => {
  const config = loadConfig();
  const issues: FieldIssue[] = [];
  const t = getGlobalT();

  if (!config.backendJwtSecretKey) {
    issues.push(issue("Jwt_Key", t("system.config.jwtRequired")));
  }

  if (
    config.backendJwtSecretKey &&
    config.backendJwtSecretKey.trim().length < 16
  ) {
    issues.push(
      issue("Jwt_Key", t("system.config.jwtTooShort"), FieldIssueType.warning)
    );
  }

  if (!config.cookieExpirationMinutes) {
    issues.push(
      issue("Cookie_Expiration", t("system.config.cookieExpirationNotSet"))
    );
  }

  if (!config.cookieName) {
    issues.push(issue("Cookie_Name", t("system.config.cookieNameNotSet")));
  }

  if (!config.userEmailRequired && !config.userUsernameRequired) {
    issues.push(
      issue(
        "Registration_Configuration",
        t("system.config.emailOrUsernameRequired")
      )
    );
  }

  return issues;
};

export { checkUsername, checkEmail, checkAuthConfiguration };
