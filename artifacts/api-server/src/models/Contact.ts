import { Schema, model, type InferSchemaType, Types } from "mongoose";

const contactSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    groupId: { type: Types.ObjectId, ref: "Group" },
    lastContactedAt: { type: Date },
    status: { type: String, enum: ["active", "blocked", "unsubscribed"], default: "active" },
  },
  { timestamps: true },
);

contactSchema.index({ userId: 1, phone: 1 }, { unique: true });

export type Contact = InferSchemaType<typeof contactSchema>;

export const ContactModel = model("Contact", contactSchema);
