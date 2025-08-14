// Load environment-specific configuration values (e.g., JWT secret).
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  changeUserPassword,
  findUserById,
  loginUser,
  registerUser,
  requestPasswordChange as requestPasswordChangeForUser,
} from "../services";

import { StrategyOptions, Strategy as JwtStrategy } from "passport-jwt";
import { PassportStatic } from "passport";
import { BadRequestError, createIssue, Issue, loadConfig } from "../lib";
import {
  checkEmail,
  checkAuthConfiguration,
  checkUsername,
  checkPassword,
  checkPasswordSetup,
} from "../lib/utils";
import normalizeEmail from "normalize-email";
import {
  addIssuesToRequest,
  RegisterUserResponseData,
  UserDocument,
} from "../types";
import { ErrorCodes } from "../lib/constants";

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
  const rawUsername: string = req.body.username?.trim() || "";
  const rawEmail: string = req.body.email?.trim().toLowerCase() || "";
  const password: string = req.body.password || "";
  const normalizedEmail: string = normalizeEmail(rawEmail);

  // Normalize email if enabled in config
  const email = envConfig.useNormalizedEmails ? normalizedEmail : rawEmail;

  // Use email as username if usernames are not required
  const username = envConfig.userUsernameRequired ? rawUsername : email;

  // Pre-registration validation (e.g., format, presence, config checks)
  let preIssues: Issue[] = [
    ...checkUsername(username),
    ...checkEmail(email),
    ...checkPassword(password),
    ...checkAuthConfiguration(),
    ...checkPasswordSetup(),
  ];

  // Attach validation issues to request and short-circuit if there are any errors
  const hasPreValidationErrors = addIssuesToRequest(req, preIssues);
  if (hasPreValidationErrors) return next();

  try {
    // Attempt to register the user (hash password, save to DB, issue JWT)
    const { token, userObject, issues } = await registerUser({
      username,
      email,
      normalizedEmail,
      password,
      jwtSecretKey,
      passwordHashLength: envConfig.passwordHashLength!,
    });

    // Attach post-registration issues (e.g., database constraints) to request
    addIssuesToRequest(req, issues);

    // Populate request data state for response middleware
    const result: RegisterUserResponseData = {
      userId: userObject?._id.toString() || null,
      success: !!token,
      registrationToken: token || null,
    };
    req.xData!.registerUserResult = result;
    req.xData!.userId = userObject?._id.toString();
    next();
  } catch (err: any) {
    const issues: Issue[] = [];
    issues.push(
      createIssue({
        code: ErrorCodes.REGISTRATION_FAILED,
      })
    );

    addIssuesToRequest(req, issues);

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
  res: Response,
  next: NextFunction
): Promise<void> => {
  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";
  let { username, password } = req.body;

  const rawUsernameOrEmail = username?.trim() || null;
  const rawPassword = password || null;

  let preIssues: Issue[] = [];

  // Validate inputs
  if (!username) {
    preIssues.push(
      createIssue({
        code: ErrorCodes.MISSING_USERNAME,
      })
    );
  }
  if (!password) {
    preIssues.push(
      createIssue({
        code: ErrorCodes.MISSING_PASSWORD,
      })
    );
  }
  preIssues = [
    ...preIssues,
    ...checkAuthConfiguration(),
    ...checkPasswordSetup(),
  ];

  // Attach validation issues to request and short-circuit if there are any errors
  const hasPreValidationErrors = addIssuesToRequest(req, preIssues);
  if (hasPreValidationErrors) return next();

  try {
    const { token, userObject, issues } = await loginUser({
      usernameOrEmail: username,
      password,
      jwtSecretKey: jwtSecretKey!,
    });

    addIssuesToRequest(req, issues);
    req.xData!.userId = userObject?._id.toString() || null;
    req.xData!.success = !!token;
    req.xData!.loginToken = token || null;

    next();
  } catch (err: any) {
    res.clearCookie(envConfig.cookieName!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    next(new BadRequestError(err.message || "Login failed"));
  }
};

/**
 * Logs out the user.
 * - Clears the JWT cookie from the browser.
 */
const logout = (_: Request, __: Response, next: NextFunction): void => {
  next();
};

/**
 * Returns the currently authenticated user.
 * Assumes passport middleware has attached `req.user`.
 */
const me = async (
  _: Request,
  __: Response,
  next: NextFunction
): Promise<void> => {
  next();
};

const requestPasswordChange = async (
  req: Request,
  __: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.user as UserDocument;
  await requestPasswordChangeForUser({ userId: id });
  next();
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
  let preIssues: Issue[] = [];

  if (!currentPassword) {
    preIssues.push(
      createIssue({
        code: ErrorCodes.MISSING_PASSWORD,
      })
    );
  }

  preIssues = [
    ...preIssues,
    ...checkPassword(newPassword),
    ...checkPasswordSetup(),
  ];

  const hasPreValidationErrors = addIssuesToRequest(req, preIssues);
  if (hasPreValidationErrors) return next();

  try {
    const { issues } = await changeUserPassword({
      userId: user._id,
      currentPassword,
      newPassword,
    });

    addIssuesToRequest(req, issues);

    next();
  } catch (err: any) {
    next(new BadRequestError(err.message || "Failed to change the password"));
  }
};

/**
 * Returns authentication status.
 * - Indicates whether `req.user` is populated by the JWT strategy.
 */
const checkAuthStatus = async (
  _: Request,
  __: Response,
  next: NextFunction
): Promise<void> => {
  next();
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
  requestPasswordChange,
};
