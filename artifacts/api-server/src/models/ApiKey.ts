import { Schema, model, type InferSchemaType, Types } from "mongoose";

const apiKeySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, default: "Default Key" },
    keyHash: { type: String, required: true },
    keyPrefix: { type: String, required: true },
    lastUsedAt: { type: Date },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

export type ApiKey = InferSchemaType<typeof apiKeySchema>;

export const ApiKeyModel = model("ApiKey", apiKeySchema);
