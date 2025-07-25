import normalizeEmail from "normalize-email";
import { BadRequestError, getGlobalT, loadConfig, resolveT } from "../lib";
import { ErrorCodes } from "../lib/constants";
import { minutesToSeconds } from "../lib/utils";
import {
  ChangePasswordResult,
  LoginUserInput,
  LoginUserResult,
  RegisterUserInput,
  RegisterUserResult,
  SessionData,
  UserDocument,
  UserRole,
} from "../types";
import {
  createLocalUser,
  findExistingUserByUsernameOrEmail,
  findUserById,
} from "./user.services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { FieldIssue, issue } from "../lib/errors";

/**
 * Registers a new user in the system.
 * - Normalizes email
 * - Checks for existing users by username and email (case-insensitive)
 * - Hashes the password
 * - Creates the user in the database
 * - Returns a signed JWT for session authentication
 */
const registerUser = async ({
  username,
  email,
  password,
  jwtSecretKey,
}: RegisterUserInput): Promise<RegisterUserResult> => {
  const envConfig = loadConfig();
  const normalizedEmail = normalizeEmail(email);
  const t = getGlobalT();

  // Check if a user already exists with the same username or email
  let existingUser = await findExistingUserByUsernameOrEmail({
    username,
    email,
    normalizedEmail,
  });

  if (existingUser) {
    return {
      token: null,
      userObject: null,
      issues: [issue(t("user"), t("auth.register.userExists"))],
    };
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user

  try {
    const newUser = await createLocalUser({
      username,
      email,
      normalizedEmail: normalizedEmail!,
      password: hashedPassword,
    });

    if (!newUser) {
      return {
        token: null,
        userObject: null,
        issues: [issue(t("user"), t("auth.register.userCreationFailed"))],
      };
    }

    // Sign a JWT token with session payload
    const token = jwt.sign(createSessionObject(newUser), jwtSecretKey, {
      expiresIn: minutesToSeconds(envConfig.cookieExpirationMinutes!),
    });
    return { token, userObject: newUser, issues: [] };
  } catch (error) {
    return {
      token: null,
      userObject: null,
      issues: [issue(t("user"), t("auth.register.userCreationFailed"))],
    };
  }
};

/**
 * Authenticates a user by email or username.
 * - Attempts to find a matching user (including normalized email)
 * - Validates the password
 * - Returns a signed JWT if successful
 */
const loginUser = async ({
  usernameOrEmail,
  password,
  jwtSecretKey,
}: LoginUserInput): Promise<LoginUserResult> => {
  const envConfig = loadConfig();
  const t = getGlobalT();

  // Try to find the user using raw input
  let user = await findExistingUserByUsernameOrEmail({ usernameOrEmail });

  // Fallback: try normalized email
  if (!user) {
    const normalizedEmail = normalizeEmail(usernameOrEmail);
    if (normalizedEmail) {
      user = await findExistingUserByUsernameOrEmail({ normalizedEmail });
    }
  }

  // If no user or password is found, reject
  if (!user) {
    return {
      token: null,
      userObject: null,
      issues: [issue(t("user"), t("notFound", { field: t("user") }))],
    };
  }

  if (!user.password) {
    return {
      token: null,
      userObject: null,
      issues: [issue(t("user"), t("auth.register.userPasswordNotFound"))],
    };
  }

  // Compare provided password with the hashed one
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      token: null,
      userObject: null,
      issues: [issue(t("password"), t("incorrect", { field: t("password") }))],
    };
  }

  // Sign and return JWT
  const token = jwt.sign(createSessionObject(user), jwtSecretKey, {
    expiresIn: minutesToSeconds(envConfig.cookieExpirationMinutes!),
  });

  return { token, userObject: user, issues: [] };
};

/**
 * Changes a user's password securely.
 * - Verifies current password
 * - Hashes and stores the new password
 */
const changeUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResult> => {
  const t = getGlobalT();
  const issues: FieldIssue[] = [];
  let continueProcess = true;

  const existingUser = await findUserById(userId);
  if (!existingUser || !existingUser.password) {
    issues.push(issue(t("user"), t("notFound", { field: t("user") })));
    continueProcess = false;
  }

  // Validate current password
  if (existingUser && continueProcess) {
    const isMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!isMatch) {
      continueProcess = false;
      issues.push(
        issue(
          t("currentPassword"),
          t("incorrect", { field: t("currentPassword") })
        )
      );
    }
  }

  // Hash and save the new password
  if (existingUser && continueProcess) {
    const hashedNew = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedNew;
    await existingUser.save();
  }
  return {
    userObject: existingUser,
    issues: issues,
  };
};

/**
 * Creates the payload object for JWT sessions.
 * Used when signing tokens for authentication.
 */
export const createSessionObject = (user: UserDocument): SessionData => {
  return {
    sub: user._id.toString(),
    username: user.username || "",
    role: user.userRole || UserRole.USER, // Fallback to USER role
  };
};

export { registerUser, loginUser, changeUserPassword };
