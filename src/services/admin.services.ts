import normalizeEmail from "normalize-email";
import { loadConfig } from "../lib";
import { UserModel } from "../models";
import { UserRole } from "../types";
import { generate } from "generate-passphrase";
import chalk from "chalk";

const createSuperAdminIfNeeded = async () => {
  const envConfig = loadConfig();
  const superAdminExists = await UserModel.findOne({
    userRole: UserRole.SUPER_ADMIN,
  });
  if (!superAdminExists) {
    const superAdminName = envConfig.superAdminName?.toString().trim();
    const superAdminEmail = envConfig.superAdminEmail?.toString().trim();
    const superAdminUsername = envConfig.superAdminUsername?.toString().trim();

    if (!superAdminEmail || !superAdminName) {
      throw new Error(
        "Super admin email and name must be provided in the environment variables"
      );
    }

    const password = generate({
      length: 2, // number of words
      separator: "-",
      titlecase: true,
      numbers: true,
    });

    const newSuperAdmin = new UserModel({
      username: superAdminUsername, // Use email as username
      email: superAdminEmail,
      name: superAdminName,
      normalizedEmail: normalizeEmail(superAdminEmail),
      password,
      userRole: UserRole.SUPER_ADMIN,
    });
    await newSuperAdmin.save();

    // Eye-catching output
    console.log(
      chalk.green.bold("\n==========================================")
    );
    console.log(
      chalk.green.bold("🚀 SUPER ADMIN ACCOUNT CREATED SUCCESSFULLY 🚀")
    );
    console.log(
      chalk.green.bold("==========================================\n")
    );

    console.log(
      `${chalk.yellow("👤 Name:")}     ${chalk.white(superAdminName)}`
    );
    console.log(
      `${chalk.yellow("📧 Email:")}    ${chalk.white(superAdminEmail)}`
    );
    console.log(
      `${chalk.yellow("🔑 Username:")} ${chalk.white(
        newSuperAdmin.username || "(none set)"
      )}`
    );
    console.log(`${chalk.yellow("🔒 Password:")} ${chalk.cyan.bold(password)}`);

    console.log(
      chalk.green.bold("\n==========================================\n")
    );
  }
};

export { createSuperAdminIfNeeded };
