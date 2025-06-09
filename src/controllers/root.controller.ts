import { Request, Response } from "express";

/**
 * Public API metadata endpoint.
 * This is useful for frontend devs, documentation tools, or simple testing.
 * It gives a quick overview of available routes and their purpose.
 */
const getApiInfo = (_req: Request, res: Response) => {
  res.json({
    name: "My Backend API",
    version: "1.0.0",
    description: "This is the public API for my backend app.",
    endpoints: [
      // AUTH
      {
        path: "/auth/register",
        method: "POST",
        description: "Register a new user",
      },
      {
        path: "/auth/login",
        method: "POST",
        description: "Login and receive JWT (via cookie)",
      },
      {
        path: "/auth/logout",
        method: "POST",
        description: "Logout user and clear token",
      },
      {
        path: "/auth/me",
        method: "GET",
        description: "Get current authenticated user's profile",
      },
      {
        path: "/auth/change-password",
        method: "POST",
        description: "Change password (authenticated)",
      },
      {
        path: "/auth/refresh-token",
        method: "POST",
        description: "Issue a new access token via refresh token",
      },
      {
        path: "/auth/status",
        method: "GET",
        description: "Check authentication status",
      },

      // PROFILE (ME)
      {
        path: "/profile",
        method: "GET",
        description: "Get authenticated user's profile",
      },
      {
        path: "/profile/email",
        method: "PUT",
        description: "Update user's email address",
      },
      {
        path: "/profile/username",
        method: "PUT",
        description: "Update user's username",
      },
      {
        path: "/profile/deactivate",
        method: "POST",
        description: "Deactivate user account (soft delete)",
      },
      {
        path: "/profile/reactivate",
        method: "POST",
        description: "Reactivate previously deactivated account",
      },
      {
        path: "/profile/:id",
        method: "PATCH",
        description: "Update additional user info (authenticated)",
      },
      {
        path: "/profile/:id",
        method: "DELETE",
        description: "Permanently delete user account",
      },
      {
        path: "/profile/users/public/:username",
        method: "GET",
        description: "Get public profile by username",
      },

      // RECOVERY
      {
        path: "/recovery/forgot-password",
        method: "POST",
        description: "Request a password reset link",
      },
      {
        path: "/recovery/reset-password",
        method: "POST",
        description: "Reset password using token",
      },
      {
        path: "/recovery/send-verification",
        method: "POST",
        description: "Send account verification email (auth required)",
      },
      {
        path: "/recovery/verify-account",
        method: "POST",
        description: "Verify user account using code/token",
      },
      {
        path: "/recovery/resend-verification",
        method: "POST",
        description: "Resend account verification email",
      },

      // SECURITY
      {
        path: "/security/sessions",
        method: "GET",
        description: "List active login sessions/devices",
      },
      {
        path: "/security/logout-others",
        method: "POST",
        description: "Logout all other sessions except current",
      },
      {
        path: "/security/enable-2fa",
        method: "POST",
        description: "Enable two-factor authentication (2FA)",
      },
      {
        path: "/security/disable-2fa",
        method: "POST",
        description: "Disable 2FA",
      },
      {
        path: "/security/verify-2fa",
        method: "POST",
        description: "Verify 2FA code",
      },

      // USERS (ADMIN)
      {
        path: "/users",
        method: "GET",
        description: "List/search users (admin)",
      },
      {
        path: "/users/:id",
        method: "GET",
        description: "Get a user by ID (admin)",
      },

      // HEALTH
      {
        path: "/health",
        method: "GET",
        description: "Basic health check to verify API is running",
      },
    ],
  });
};

export { getApiInfo };
