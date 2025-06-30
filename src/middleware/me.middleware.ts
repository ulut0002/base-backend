import { RequestHandler } from "express";
import {
  mePost1,
  mePost2,
  updateEmailPost1,
  updateEmailPost2,
  updateUsernamePost1,
  updateUsernamePost2,
  deactivateAccountPost1,
  deactivateAccountPost2,
  reactivateAccountPost1,
  reactivateAccountPost2,
  singleUserProfilePost1,
  singleUserProfilePost2,
  deleteAccountPost1,
  deleteAccountPost2,
  publicProfilePost1,
  publicProfilePost2,
} from "./me.post.middleware.js";

import {
  mePre1,
  mePre2,
  updateEmailPre1,
  updateEmailPre2,
  updateUsernamePre1,
  updateUsernamePre2,
  deactivateAccountPre1,
  deactivateAccountPre2,
  reactivateAccountPre1,
  reactivateAccountPre2,
  deleteAccountPre1,
  deleteAccountPre2,
  publicProfilePre1,
  publicProfilePre2,
  singleUserPre1,
  singleUserPre2,
} from "./me.pre.middleware.js";
import { MeMiddlewareMap } from "../types/middleware.types.js";

export const preMeMiddleware: MeMiddlewareMap = {
  profile: [mePre1, mePre2],
  email: [updateEmailPre1, updateEmailPre2],
  username: [updateUsernamePre1, updateUsernamePre2],
  deactivate: [deactivateAccountPre1, deactivateAccountPre2],
  reactivate: [reactivateAccountPre1, reactivateAccountPre2],
  updateUserById: [singleUserPre1, singleUserPre2],
  deleteUserById: [deleteAccountPre1, deleteAccountPre2],
  publicProfile: [publicProfilePre1, publicProfilePre2],
};

export const postMeMiddleware: MeMiddlewareMap = {
  profile: [mePost1, mePost2],
  email: [updateEmailPost1, updateEmailPost2],
  username: [updateUsernamePost1, updateUsernamePost2],
  deactivate: [deactivateAccountPost1, deactivateAccountPost2],
  reactivate: [reactivateAccountPost1, reactivateAccountPost2],
  updateUserById: [singleUserProfilePost1, singleUserProfilePost2],
  deleteUserById: [deleteAccountPost1, deleteAccountPost2],
  publicProfile: [publicProfilePost1, publicProfilePost2],
};
