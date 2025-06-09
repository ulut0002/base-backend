import { UserModel } from "../modals";
import { UserRegistrationDTO } from "../types";

/**
 * Finds a user document by their username.
 * @param username - The username to look up.
 * @returns A promise resolving to the user document or null.
 */
const findUserByUsername = async (username: string) => {
  return await UserModel.findOne({ username });
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
 * Finds a user by matching against username, email, or a combined field.
 * Useful for login, registration checks, or password reset flows.
 *
 * @param params.usernameOrEmail - A value that could be either username or email.
 * @param params.username - Optional explicit username.
 * @param params.email - Optional explicit email.
 * @returns The matched user document, or null if not found.
 */
const findExistingUserByUsernameOrEmail = async ({
  usernameOrEmail,
  username,
  email,
  normalizedEmail,
}: {
  usernameOrEmail?: string | null;
  username?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
}) => {
  const orConditions = [];

  if (usernameOrEmail) {
    orConditions.push(
      { username: usernameOrEmail },
      { email: usernameOrEmail }
    );
  }
  if (username) {
    orConditions.push({ username });
  }
  if (email) {
    orConditions.push({ email });
  }

  if (normalizedEmail) {
    orConditions.push({ normalizedEmail });
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

const getPublicUserProfile = async (username: string) => {
  // TODO: fetch public read-only profile
  return null;
};

const updateUser = async (id: string, data: any) => {
  // TODO: update user data
  return null;
};

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
