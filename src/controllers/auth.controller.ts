// Load environment-specific configuration values (e.g., JWT secret).
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  changeUserPassword,
  findUserById,
  loginUser,
  registerUser,
} from "../services";

import { StrategyOptions, Strategy as JwtStrategy } from "passport-jwt";
import { PassportStatic } from "passport";
import {
  ApiError,
  BadRequestError,
  createErrorIf,
  FieldIssue,
  issue,
  loadConfig,
} from "../lib";
import { ErrorCodes } from "../lib/constants";
import {
  checkEmail,
  checkAuthConfiguration,
  checkUsername,
} from "../lib/utils";
import normalizeEmail from "normalize-email";
import { addIssuesToRequest } from "../types";

/**
 * Configures Passport.js with JWT strategy.
 * Uses the token stored in HTTP-only cookies for user authentication.
 * Attaches the decoded user to `req.user` if valid.
 */
const configureJwtStrategy = (passport: PassportStatic) => {
  const envConfig = loadConfig();
  const secret = envConfig.backendJwtSecretKey;

  const opts: StrategyOptions = {
    jwtFromRequest: (req: Request) => {
      if (req && req.cookies) {
        return req.cookies.token; // Extract token from signed cookie
      }
      return null;
    },
    secretOrKey: secret!,
  };

  // Attach the JWT strategy to passport
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await findUserById(payload.sub); // Decode user ID from token
        return user ? done(null, user) : done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

/**
 * Handles user registration.
 *
 * Flow:
 * 1. Load environment configuration.
 * 2. Normalize and sanitize input fields (username, email, password).
 * 3. Validate input fields and configuration.
 * 4. If validation passes, attempt to register the user.
 * 5. On success, set token and user data on the request.
 * 6. Add all issues (validation or registration-related) to req.xMeta.
 * 7. Pass control to the next middleware (response handler).
 *
 * Notes:
 * - The final response is handled by a separate middleware that inspects req.xMeta and req.xData.
 */
const register = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  // Load app configuration (JWT secret, email normalization, etc.)
  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";

  // Extract and normalize inputs from request body
  const rawUsername = req.body.username?.trim() || "";
  const rawEmail = req.body.email?.trim().toLowerCase() || "";
  const password = req.body.password || "";

  // Normalize email if enabled in config
  const email = envConfig.normalizeEmails ? normalizeEmail(rawEmail) : rawEmail;

  // Use email as username if usernames are not required
  const username = envConfig.userUsernameRequired ? rawUsername : email;

  // Pre-registration validation (e.g., format, presence, config checks)
  const issues: FieldIssue[] = [
    ...checkUsername(username, req.t),
    ...checkEmail(email),
    ...checkAuthConfiguration(),
  ];

  // Attach validation issues to request and short-circuit if there are any errors
  const hasPreValidationErrors = addIssuesToRequest(req, issues);
  if (hasPreValidationErrors) return next();

  try {
    // Attempt to register the user (hash password, save to DB, issue JWT)
    const {
      token,
      userObject,
      issues: postIssues,
    } = await registerUser({
      username,
      email,
      password,
      jwtSecretKey,
    });

    // Attach post-registration issues (e.g., database constraints) to request
    const hasPostValidationErrors = addIssuesToRequest(req, postIssues);

    // Populate request data state for response middleware
    req.xData!.userId = userObject?._id.toString() || null;
    req.xData!.success = !!token;
    req.xData!.registrationToken = token || null;

    // Pass control to next response handler
    next();
  } catch (err: any) {
    // Unexpected failure (e.g., DB error, hashing error)
    next(new BadRequestError(err.message || "Registration failed"));
  }
};
/**
 * Handles user login.
 * - Validates input credentials.
 * - Delegates login logic to auth service.
 * - Sets JWT token in HTTP-only cookie on success.
 */
const login = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  // Load app configuration (JWT secret, email normalization, etc.)
  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";

  const rawUsernameOrEmail = req.body.username?.trim() || null;
  const rawPassword = req.body.password || null;

  let { username, password } = req.body;

  let issues: FieldIssue[] = [];

  // Validate inputs
  if (!username) {
    issues.push(issue("username", "Username is required"));
  }
  if (!password) {
    issues.push(issue("password", "Password is required"));
  }
  issues = [...issues, ...checkAuthConfiguration()];

  // Attach validation issues to request and short-circuit if there are any errors
  const hasPreValidationErrors = addIssuesToRequest(req, issues);
  if (hasPreValidationErrors) return next();

  try {
    const {
      token,
      userObject,
      issues: postIssues,
    } = await loginUser({
      usernameOrEmail: username,
      password,
      jwtSecretKey: jwtSecretKey!,
    });

    addIssuesToRequest(req, postIssues);
    req.xData!.userId = userObject?._id.toString() || null;
    req.xData!.success = !!token;
    req.xData!.loginToken = token || null;

    next();
  } catch (err: any) {
    next(new BadRequestError(err.message || "Login failed"));
  }
};

/**
 * Logs out the user.
 * - Clears the JWT cookie from the browser.
 */
const logout = (req: Request, res: Response): void => {
  const config = loadConfig();
  if (config.cookieName) {
    res.clearCookie(config.cookieName);
  }
  res.status(200).json({ message: "Logged out successfully." });
};

/**
 * Returns the currently authenticated user.
 * Assumes passport middleware has attached `req.user`.
 */
const me = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) throw new BadRequestError(ErrorCodes.UNAUTHORIZED);

  // Strip password before returning user object
  const { password, ...safeUser } = (user as any).toObject();
  res.json({ user: safeUser });
};

/**
 * Refreshes the JWT token.
 * - Validates the existing refresh token (from cookie).
 * - Issues a new access token and sets it in an HTTP-only cookie.
 */
const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey;

  if (!token || !jwtSecretKey) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecretKey) as any;
    const newToken = jwt.sign(
      { sub: payload.sub, username: payload.username },
      jwtSecretKey,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(200)
      .json({ message: "Token refreshed" });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
/**
 * Allows a logged-in user to change their password.
 * - Validates current and new passwords.
 * - Delegates logic to the service.
 */
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as any;
  const { currentPassword, newPassword } = req.body;
  createErrorIf({
    fieldName: "currentPassword",
    condition: currentPassword,
    ErrorType: BadRequestError,
    details: "Current password is required",
    code: ErrorCodes.MISSING_PASSWORD,
  });
  createErrorIf({
    fieldName: "newPassword",
    condition: newPassword,
    ErrorType: BadRequestError,
    details: "New password is required",
    code: ErrorCodes.MISSING_PASSWORD,
  });

  try {
    await changeUserPassword({
      userId: user._id,
      currentPassword,
      newPassword,
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err: any) {
    next(new BadRequestError(err.message || "Failed to change password"));
  }
};

/**
 * Returns authentication status.
 * - Indicates whether `req.user` is populated by the JWT strategy.
 */
const checkAuthStatus = async (req: Request, res: Response): Promise<void> => {
  const isLoggedIn = Boolean(req.user);
  res.status(200).json({ authenticated: isLoggedIn });
};

export {
  register,
  login,
  configureJwtStrategy,
  logout,
  me,
  refreshToken,
  changePassword,
  checkAuthStatus,
};
