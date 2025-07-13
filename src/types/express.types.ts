import "express";
import { FieldIssue, FieldIssueType } from "../lib";
import { TypeOrNull } from "./generic.types";
import { Request } from "express";
import { TFunction } from "i18next";

// Update src/middleware/request.middleware.ts as well

interface RequestMetaData {
  errors: FieldIssue[];
  warnings: FieldIssue[];
  messages: FieldIssue[];
  addIssue: (issue: FieldIssue, issueType: FieldIssueType) => void;
  hasErrors: () => boolean;
  hasWarnings: () => boolean;
  hasMessages: () => boolean;
  getAllIssues: () => {
    errorLength: number;
    warningLength: number;
    messageLength: number;
    errors: FieldIssue[];
    warnings: FieldIssue[];
    messages: FieldIssue[];
  };
  getErrors: () => FieldIssue[];
  getWarnings: () => FieldIssue[];
  getMessages: () => FieldIssue[];
}

export interface RequestDataState {
  userId?: TypeOrNull<string>;
  registrationToken?: TypeOrNull<string>;
  loginToken?: TypeOrNull<string>;
  success?: TypeOrNull<boolean>;
  language?: string;
  [key: string]: any;
}

declare module "express" {
  interface Request {
    authToken?: string;
    authUser?: any; // optional: attach user data if needed
    xMeta?: RequestMetaData; // metadata for errors, warnings, messages
    xData?: RequestDataState; // state for request data
    t?: TFunction;
  }
}

/**
 * Adds a list of FieldIssues to req.xMeta and returns true if there are any error-level issues.
 */
export function addIssuesToRequest(
  req: Request,
  issues: FieldIssue[] = []
): boolean {
  let hasErrors = false;

  issues.forEach((issue) => {
    req.xMeta?.addIssue(issue, issue.type ?? FieldIssueType.error);
    if ((issue.type ?? FieldIssueType.error) === FieldIssueType.error) {
      hasErrors = true;
    }
  });

  return hasErrors;
}
