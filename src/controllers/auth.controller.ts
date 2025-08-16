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
  RegisterUser_Response,
  UserDocument,
} from "../types";
import { ErrorCodes } from "../lib/constants";

const configureJwtStrategy = (passport: PassportStatic) => {
  const envConfig = loadConfig();
  const secret = envConfig.backendJwtSecretKey;

  const opts: StrategyOptions = {
    jwtFromRequest: (req: Request) => {
      if (req && req.cookies) {
        return req.cookies.token;
      }
      return null;
    },
    secretOrKey: secret!,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await findUserById(payload.sub);
        return user ? done(null, user) : done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

const register = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const envConfig = loadConfig();
  const jwtSecretKey = envConfig.backendJwtSecretKey || "";

  const rawUsername: string = req.body.username?.trim() || "";
  const rawEmail: string = req.body.email?.trim().toLowerCase() || "";
  const password: string = req.body.password || "";
  const normalizedEmail: string = normalizeEmail(rawEmail);

  const email = envConfig.useNormalizedEmails ? normalizedEmail : rawEmail;

  const username = envConfig.userUsernameRequired ? rawUsername : email;

  let preIssues: Issue[] = [
    ...checkUsername(username),
    ...checkEmail(email),
    ...checkPassword(password),
    ...checkAuthConfiguration(),
    ...checkPasswordSetup(),
  ];

  const hasPreValidationErrors = addIssuesToRequest(req, preIssues);
  if (hasPreValidationErrors) return next();

  try {
    const { token, userObject, issues } = await registerUser({
      username,
      email,
      normalizedEmail,
      password,
      jwtSecretKey,
      passwordHashLength: envConfig.passwordHashLength!,
    });

    addIssuesToRequest(req, issues);

    const result: RegisterUser_Response = {
      userId: userObject?._id.toString() || null,
      success: !!token,
      registrationToken: token || null,
    };
    req.xContextData!.registerUserResult = result;
    req.xContextData!.userId = userObject?._id.toString();
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

  const hasPreValidationErrors = addIssuesToRequest(req, preIssues);
  if (hasPreValidationErrors) return next();

  try {
    const { token, userObject, issues } = await loginUser({
      usernameOrEmail: username,
      password,
      jwtSecretKey: jwtSecretKey!,
    });

    addIssuesToRequest(req, issues);
    req.xContextData!.userId = userObject?._id.toString() || null;
    req.xContextData!.success = !!token;
    req.xContextData!.loginToken = token || null;

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

const logout = (_: Request, __: Response, next: NextFunction): void => {
  next();
};

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
