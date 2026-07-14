import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    creditBalance: { type: Number, default: 0 },
    metaPhoneNumberId: { type: String, index: true, sparse: true },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
