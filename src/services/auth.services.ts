import normalizeEmail from "normalize-email";
import { BadRequestError, loadConfig } from "../lib";
import { ErrorCodes } from "../lib/constants";
import { minutesToSeconds } from "../lib/utils";
import {
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
import { issue } from "../lib/errors";

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
      issues: [issue("user", "User already exists")],
    };
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await createLocalUser({
    username,
    email,
    normalizedEmail: normalizedEmail!,
    password: hashedPassword,
  });

  // Sign a JWT token with session payload
  const token = jwt.sign(createSessionObject(newUser), jwtSecretKey, {
    expiresIn: minutesToSeconds(envConfig.cookieExpirationMinutes!),
  });

  return { token, userObject: newUser, issues: [] };
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
      issues: [issue("user", "User not found")],
    };
  }

  if (!user.password) {
    return {
      token: null,
      userObject: null,
      issues: [issue("user", "User password not found")],
    };
  }

  // Compare provided password with the hashed one
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      token: null,
      userObject: null,
      issues: [issue("password", "Invalid credentials")],
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
}): Promise<void> => {
  const existingUser = await findUserById(userId);
  if (!existingUser || !existingUser.password) {
    throw new BadRequestError("User not found", ErrorCodes.USER_NOT_FOUND);
  }

  // Validate current password
  const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
  if (!isMatch) {
    throw new BadRequestError(
      "Incorrect current password",
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  // Hash and save the new password
  const hashedNew = await bcrypt.hash(newPassword, 10);
  existingUser.password = hashedNew;
  await existingUser.save();
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
