import { model, Schema, Types } from "mongoose";
import { VerificationCodeStatus, VerificationCodeType } from "../types";

export interface VerificationCodeDocument {
  userId: Types.ObjectId;
  code: string;
  type: VerificationCodeType;
  status: VerificationCodeStatus;
  expiresAt: Date;
  verifiedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const verificationCodeSchema = new Schema<VerificationCodeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["PASSWORD_RESET", "EMAIL_VERIFICATION", "TWO_FACTOR", "INVITE"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "EXPIRED"],
      default: "PENDING",
    },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed }, // optional payload (email, IP, etc.)
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const VerificationCodeModel = model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema
);

export { VerificationCodeModel };
