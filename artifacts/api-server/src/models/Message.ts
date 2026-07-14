import { Schema, model, type InferSchemaType, Types } from "mongoose";

const messageSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    contactId: { type: Types.ObjectId, ref: "Contact", required: true, index: true },
    campaignId: { type: Types.ObjectId, ref: "Campaign" },
    direction: { type: String, enum: ["OUTBOUND", "INBOUND"], required: true },
    body: { type: String },
    templateId: { type: Types.ObjectId, ref: "Template" },
    whatsappMessageId: { type: String, index: true },
    status: {
      type: String,
      enum: ["QUEUED", "SENT", "DELIVERED", "READ", "FAILED", "RECEIVED"],
      default: "QUEUED",
    },
    failureReason: { type: String },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true },
);

export type Message = InferSchemaType<typeof messageSchema>;

export const MessageModel = model("Message", messageSchema);
