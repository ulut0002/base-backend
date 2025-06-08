// Load environment-specific configuration values (e.g., JWT secret).
import { Request, Response } from "express";
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
  createErrorResponse,
  createValidationErrorCollector,
  loadConfig,
} from "../lib";
import { MessageCodes, MessageTexts } from "../lib/constants";

/**
 * Configures Passport.js with JWT strategy.
 * Uses the token stored in HTTP-only cookies for user authentication.
 * Attaches the decoded user to `req.user` if valid.
 */
const configureJwtStrategy = (passport: PassportStatic) => {
  const envConfig = loadConfig();
  const secret = envConfig.BACKEND_JWT_SECRET_KEY;

  if (!secret || secret.trim().length < 5) {
    console.error("JWT secret key is missing or too short");
    return;
  }

  const opts: StrategyOptions = {
    jwtFromRequest: (req: Request) => {
      if (req && req.cookies) {
        return req.cookies.token; // Extract token from signed cookie
      }
      return null;
    },
    secretOrKey: secret,
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
const register = async (req: Request, res: Response): Promise<void> => {
  const { username = "", email = "", password = "", name = "" } = req.body;

  const envConfig = loadConfig();

  const errors = createValidationErrorCollector();
  errors.add("username", username, MessageCodes.REQUIRED_FIELD);
  errors.add("email", email, MessageCodes.REQUIRED_FIELD);
  errors.add("password", password, MessageCodes.REQUIRED_FIELD);

  // Validate required fields
  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.VALIDATION_ERROR,
        message: MessageTexts[MessageCodes.VALIDATION_ERROR],
        details: errors.get(),
      })
    );
    return;
  }

  const jwtSecretKey = envConfig.BACKEND_JWT_SECRET_KEY || "";
  errors.add(
    "securityKey",
    jwtSecretKey && jwtSecretKey.trim().length >= 5,
    MessageCodes.MISSING_SECURITY_KEY
  );

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.MISSING_SECURITY_KEY,
        message: MessageTexts[MessageCodes.MISSING_SECURITY_KEY],
        details: errors.get(),
      })
    );
    return;
  }

  try {
    const { token } = await registerUser({
      username,
      email,
      password,
      jwtSecretKey,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(201)
      .json({ message: "Authentication successful" });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};

/**
 * Handles user login.
 * - Validates input credentials.
 * - Delegates login logic to auth service.
 * - Sets JWT token in HTTP-only cookie on success.
 */
const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const errors = createValidationErrorCollector();

  // Validate inputs
  errors.add("username", username, MessageCodes.REQUIRED_FIELD);
  errors.add("password", password, MessageCodes.REQUIRED_FIELD);

  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.BACKEND_JWT_SECRET_KEY;

  errors.add(
    "securityKey",
    jwtSecretKey && jwtSecretKey.trim().length >= 5,
    MessageCodes.MISSING_SECURITY_KEY
  );

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.VALIDATION_ERROR,
        message: MessageTexts[MessageCodes.VALIDATION_ERROR],
        details: errors.get(),
      })
    );
    return;
  }

  try {
    const { token } = await loginUser({
      username,
      password,
      jwtSecretKey: jwtSecretKey!,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(200)
      .json({ message: "Authentication successful" });
  } catch (error) {
    res.status(401).json(
      createErrorResponse({
        code: MessageCodes.AUTH_FAILED,
        message: MessageTexts[MessageCodes.AUTH_FAILED],
        details: [],
        showDetails: false,
      })
    );
  }
};

/**
 * Logs out the user.
 * - Clears the JWT cookie from the browser.
 */
const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

/**
 * Returns the currently authenticated user.
 * Assumes passport middleware has attached `req.user`.
 */
const me = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

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
  const jwtSecretKey = envConfig.BACKEND_JWT_SECRET_KEY;

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
const changePassword = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as any;
  const { currentPassword, newPassword } = req.body;
  const errors = createValidationErrorCollector();

  errors.add("currentPassword", currentPassword, MessageCodes.REQUIRED_FIELD);
  errors.add("newPassword", newPassword, MessageCodes.REQUIRED_FIELD);

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.VALIDATION_ERROR,
        message: MessageTexts[MessageCodes.VALIDATION_ERROR],
        details: errors.get(),
      })
    );
    return;
  }

  try {
    await changeUserPassword({
      userId: user._id,
      currentPassword,
      newPassword,
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err: any) {
    const message = err.message || "Server error";

    const statusCode =
      message === "User not found"
        ? 404
        : message === "Incorrect current password"
        ? 403
        : 500;

    res.status(statusCode).json({ message });
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
