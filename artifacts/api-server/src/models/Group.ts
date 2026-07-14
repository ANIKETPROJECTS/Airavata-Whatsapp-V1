import { Schema, model, type InferSchemaType, Types } from "mongoose";

const groupSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export type Group = InferSchemaType<typeof groupSchema>;

export const GroupModel = model("Group", groupSchema);
