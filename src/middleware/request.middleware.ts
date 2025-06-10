import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types";

/**
 * Middleware to ensure that `req.body` is always defined and an object.
 */
const ensureBody = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body || typeof req.body !== "object") {
    (req as any).body = {};
  }
  next();
};

/**
 * Role hierarchy for comparing roles by privilege level.
 */
const rolePriority: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPERADMIN]: 3,
};

/**
 * Middleware to check if the authenticated user has sufficient role privilege.
 *
 * Accepts one or more allowed roles and permits access if the user's role is equal
 * or higher in privilege.
 */
function checkRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRole: UserRole = user.role as UserRole;
    const userLevel = rolePriority[userRole];
    const requiredLevels = allowedRoles.map((role) => rolePriority[role]);

    // Allow access if user's role is equal or higher than any allowed role
    const hasPrivilege = requiredLevels.some((level) => userLevel >= level);

    if (!hasPrivilege) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}

export { ensureBody, checkRole };
