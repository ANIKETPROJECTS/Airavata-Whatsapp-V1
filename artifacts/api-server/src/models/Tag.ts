import { Schema, model, type InferSchemaType, Types } from "mongoose";

const tagSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "#22c55e" },
  },
  { timestamps: true },
);

tagSchema.index({ userId: 1, name: 1 }, { unique: true });

export type Tag = InferSchemaType<typeof tagSchema>;

export const TagModel = model("Tag", tagSchema);
