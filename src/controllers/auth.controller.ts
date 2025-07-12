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
import { ApiError, BadRequestError, createErrorIf, loadConfig } from "../lib";
import { ErrorCodes, MessageCodes, MessageTexts } from "../lib/constants";
import {
  checkEmail,
  checkJwtSecretKey,
  checkUsername,
  minutesToMilliseconds,
} from "../lib/utils";

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
 * - Validates input fields (username, email, password).
 * - Hashes the password.
 * - Creates a new user in the database.
 * - Issues a JWT token and sets it in an HTTP-only cookie.
 */
const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let { username = "", email = "", password = "" } = req.body;
  username = username.trim();
  email = email.trim().toLowerCase();

  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";

  checkUsername(username);
  checkEmail(email);
  checkJwtSecretKey(jwtSecretKey);
  createErrorIf({
    fieldName: "Cookie Expiration in Minutes",
    condition: envConfig.cookieExpirationMinutes,
    ErrorType: ApiError,
    details: "Cookie expiration time is not set",
    code: ErrorCodes.MISSING_COOKIE_EXPIRATION,
  });

  try {
    const { token } = await registerUser({
      username,
      email,
      password,
      jwtSecretKey,
    });

    res
      .cookie(envConfig.cookieName!, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: minutesToMilliseconds(envConfig.cookieExpirationMinutes!),
      })
      .status(201)
      .json({ message: "Authentication successful" });
  } catch (err: any) {
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
  let { username, password } = req.body;
  username = username.trim();

  // Validate inputs

  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";

  createErrorIf({
    fieldName: "username",
    condition: username,
    ErrorType: BadRequestError,
    details: "Username is required",
    code: ErrorCodes.MISSING_USERNAME,
  });
  createErrorIf({
    fieldName: "password",
    condition: password,
    ErrorType: BadRequestError,
    details: "Password is required",
    code: ErrorCodes.MISSING_PASSWORD,
  });

  createErrorIf({
    fieldName: "Cookie Expiration in Minutes",
    condition: envConfig.cookieExpirationMinutes,
    ErrorType: ApiError,
    details: "Cookie expiration time is not set",
    code: ErrorCodes.MISSING_COOKIE_EXPIRATION,
  });
  checkJwtSecretKey(jwtSecretKey);

  try {
    const { token } = await loginUser({
      usernameOrEmail: username,
      password,
      jwtSecretKey: jwtSecretKey!,
    });

    req.authToken = token;
    next();
  } catch (err: any) {
    next(new BadRequestError(err.message || "Login failed"));
  }
};

const loginSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const envConfig = loadConfig();

  if (!req.authToken) {
    return next(new ApiError("Missing token", 500));
  }

  res
    .cookie(envConfig.cookieName!, req.authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: minutesToMilliseconds(envConfig.cookieExpirationMinutes!),
    })
    .status(200)
    .json({ message: "Authentication successful" });
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
  loginSuccess,
  configureJwtStrategy,
  logout,
  me,
  refreshToken,
  changePassword,
  checkAuthStatus,
};
