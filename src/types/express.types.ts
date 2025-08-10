import "express";
import { Issue, IssueType } from "../lib";
import { TypeOrNull } from "./generic.types";
import { Request } from "express";
import { TFunction } from "i18next";

// Update src/middleware/request.middleware.ts as well

interface RequestMetaData {
  errors: Issue[];
  warnings: Issue[];
  messages: Issue[];
  addIssue: (issue: Issue, issueType: IssueType) => void;
  hasErrors: () => boolean;
  hasWarnings: () => boolean;
  hasMessages: () => boolean;
  getAllIssues: () => {
    errorLength: number;
    warningLength: number;
    messageLength: number;
    errors: Issue[];
    warnings: Issue[];
    messages: Issue[];
  };
  getErrors: () => Issue[];
  getWarnings: () => Issue[];
  getMessages: () => Issue[];
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
  issues: Issue[] = []
): boolean {
  let hasErrors = false;

  issues.forEach((issue) => {
    req.xMeta?.addIssue(issue, issue.type ?? IssueType.error);
    if ((issue.type ?? IssueType.error) === IssueType.error) {
      hasErrors = true;
    }
  });

  return hasErrors;
}
