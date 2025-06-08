import { LoginUserInput, RegisterUserInput } from "../types";
import {
  createLocalUser,
  findExistingUserByUsernameOrEmail,
  findUserById,
  findUserByUsername,
} from "./user.services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async ({
  username,
  email,
  password,
  jwtSecretKey,
}: RegisterUserInput): Promise<{ token: string }> => {
  const existingUser = await findExistingUserByUsernameOrEmail(username, email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createLocalUser({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { sub: newUser._id, username: newUser.username },
    jwtSecretKey,
    {
      expiresIn: "1h",
    }
  );

  return { token };
};

const loginUser = async ({
  username,
  password,
  jwtSecretKey,
}: LoginUserInput): Promise<{ token: string }> => {
  const user = await findUserByUsername(username);

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { sub: user._id, username: user.username },
    jwtSecretKey,
    {
      expiresIn: "1h",
    }
  );

  return { token };
};

/**
 * Changes the password for a user.
 * - Verifies the current password.
 * - Hashes and saves the new password.
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
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
  if (!isMatch) {
    throw new Error("Incorrect current password");
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);
  existingUser.password = hashedNew;
  await existingUser.save();
};

export { registerUser, loginUser, changeUserPassword };
