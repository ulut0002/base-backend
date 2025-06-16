import { Document, Types } from "mongoose";

/**
 * DTO for registering a user via web (e.g., REST or form).
 * Used before hitting the database layer.
 * DTO: Data Transfer Object
 */
interface UserRegistrationDTO {
  username?: string;
  email?: string;
  normalizedEmail?: string;
  password: string;
}

interface LinkedObject {
  key: string;
  data: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents the full input shape for creating a user,
 * including optional OAuth fields.
 */
interface NewUserInput {
  username?: string;
  name?: string;
  email?: string;
  normalizedEmail?: string;
  password: string;
  facebookId?: string;
  googleId?: string;
  githubId?: string;
  linkedinId?: string;
  profilePicture?: string;
  linkedObjects?: LinkedObject[];
}

/**
 * Represents the MongoDB user document, extending input with DB-specific metadata.
 */
interface UserDocument extends NewUserInput, Document {
  _id: Types.ObjectId;
  linkedObjects?: LinkedObject[];

  isVerified: { type: Boolean; default: false };
  verifiedAt: { type: Date };

  lastLogin?: Date;
  userRole: string; // e.g., "admin", "user", etc.
}

export type { UserRegistrationDTO, NewUserInput, UserDocument, LinkedObject };
