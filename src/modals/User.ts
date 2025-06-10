// src/models/User.ts

import { Schema, model } from "mongoose";
import { UserDocument, UserRole } from "../types";

/**
 * Mongoose schema definition for the User model.
 * Supports both local (username/password) and OAuth-based authentication.
 */
const userSchema = new Schema<UserDocument>(
  {
    // For traditional username-based login (optional for OAuth users)
    username: { type: String, unique: true, sparse: true }, // `sparse` allows multiple docs to skip this field

    // Common fields
    name: { type: String },
    email: { type: String, unique: true, sparse: true }, // Can be optional for some OAuth providers
    normalizedEmail: { type: String, unique: true, sparse: true }, // Normalized email for case-insensitive lookups

    // For local strategy (email/password based)
    password: { type: String }, // Stored as a bcrypt hash

    // For third-party OAuth strategies
    facebookId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },

    // Optional user profile info
    profilePicture: { type: String },
    lastLogin: { type: Date },
    userRole: {
      type: String,
      enum: Object.values(UserRole), // Define your roles here
      default: UserRole.USER, // Default role for new users
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Mongoose model
const UserModel = model<UserDocument>("User", userSchema);
export { UserModel };
