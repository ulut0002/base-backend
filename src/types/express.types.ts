import "express";
import { FieldIssue, FieldIssueType } from "../lib";
import { TypeOrNull } from "./generic.types";

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
}

export interface RequestDataState {
  userId?: TypeOrNull<string>;
  registrationToken?: TypeOrNull<string>;
  success?: TypeOrNull<boolean>;
  [key: string]: any;
}

declare module "express" {
  interface Request {
    authToken?: string;
    authUser?: any; // optional: attach user data if needed
    xMeta?: RequestMetaData; // metadata for errors, warnings, messages
    xData?: RequestDataState; // state for request data
  }
}
