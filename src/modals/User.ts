// src/models/User.ts

import { Schema, model } from "mongoose";
import { LinkedObject, UserDocument, UserRole } from "../types";

const linkedObjectSchema = new Schema(
  {
    key: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, _id: false } // _id: false if you don't want an ObjectId for each
);

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
    linkedObjects: { type: [linkedObjectSchema], default: [] },
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

userSchema.index({ "linkedObjects.key": 1 });

userSchema.methods.getLinkedObjectsByKey = function (
  this: UserDocument,
  key: string
): LinkedObject[] {
  return this.linkedObjects?.filter((obj) => obj.key === key) || [];
};

userSchema.methods.addLinkedObject = function (
  this: UserDocument,
  newObj: LinkedObject
): Promise<UserDocument> {
  this.linkedObjects?.push(newObj);
  return this.save();
};

// Create and export the Mongoose model
const UserModel = model<UserDocument>("User", userSchema);
export { UserModel };
