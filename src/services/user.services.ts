import { UserModel } from "../modals";
import { TypeOrNull, UserRegistrationDTO } from "../types";

/**
 * Escapes special regex characters for safe matching.
 */
const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Case-insensitive equality match using regex.
 */
const regexEquals = (value: string) =>
  new RegExp(`^${escapeRegex(value)}$`, "i");

/**
 * Finds a user document by their username (case-insensitive).
 * @param username - The username to look up.
 * @returns A promise resolving to the user document or null.
 */
const findUserByUsername = async (username: string) => {
  return await UserModel.findOne({ username: regexEquals(username) });
};

/**
 * Finds a user by their MongoDB ObjectId.
 * @param userId - The user's unique ObjectId.
 * @returns A promise resolving to the user document or null.
 */
const findUserById = async (userId: string) => {
  return await UserModel.findById({ _id: userId });
};

/**
 * Finds a user by matching against username, email, or normalized email.
 * All matches are case-insensitive.
 *
 * Useful for login, registration checks, or password reset flows.
 *
 * @param params.usernameOrEmail - A value that could be either username or email.
 * @param params.username - Optional explicit username.
 * @param params.email - Optional explicit email.
 * @param params.normalizedEmail - Optional normalized email (e.g., lowercased).
 * @returns The matched user document, or null if not found.
 */
const findExistingUserByUsernameOrEmail = async ({
  usernameOrEmail,
  username,
  email,
  normalizedEmail,
}: {
  usernameOrEmail?: TypeOrNull<string>;
  username?: TypeOrNull<string>;
  email?: TypeOrNull<string>;
  normalizedEmail?: TypeOrNull<string>;
}) => {
  const orConditions: Record<string, any>[] = [];

  if (usernameOrEmail) {
    orConditions.push(
      { username: regexEquals(usernameOrEmail) },
      { email: regexEquals(usernameOrEmail) }
    );
  }

  if (username) {
    orConditions.push({ username: regexEquals(username) });
  }

  if (email) {
    orConditions.push({ email: regexEquals(email) });
  }

  if (normalizedEmail) {
    orConditions.push({ normalizedEmail: regexEquals(normalizedEmail) });
  }

  if (orConditions.length === 0) return null;

  return await UserModel.findOne({ $or: orConditions });
};

/**
 * Creates and saves a new local user in the database.
 * Password should be hashed before passing into this function.
 * @param newUser - New user data object (already validated and hashed).
 * @returns The newly created user document.
 */
const createLocalUser = async (newUser: UserRegistrationDTO) => {
  const user = new UserModel(newUser);
  return await user.save();
};

/**
 * Retrieves users with pagination, search, and sorting.
 * TODO: Implement actual DB logic.
 */
const getUsers = async (options: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  // TODO: implement DB query with pagination, search, and sorting
  return {
    total: 0,
    page: options.page,
    limit: options.limit,
    users: [],
  };
};

/**
 * Fetches a public read-only user profile.
 * TODO: Implement actual logic.
 */
const getPublicUserProfile = async (username: string) => {
  // TODO: fetch public read-only profile
  return null;
};

/**
 * Updates a user by ID.
 * TODO: Implement actual update logic.
 */
const updateUser = async (id: string, data: any) => {
  // TODO: update user data
  return null;
};

/**
 * Deletes a user by ID.
 * TODO: Implement actual delete logic.
 */
const deleteUser = async (id: string) => {
  // TODO: delete user
  return true;
};

export {
  findUserByUsername,
  findUserById,
  findExistingUserByUsernameOrEmail,
  createLocalUser,
  getUsers,
  getPublicUserProfile,
  updateUser,
  deleteUser,
};
