import { Schema, model, type InferSchemaType, Types } from "mongoose";

const creditTransactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["PURCHASE", "DEDUCTION", "REFUND", "ADJUSTMENT"], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    campaignId: { type: Types.ObjectId, ref: "Campaign" },
    description: { type: String },
  },
  { timestamps: true },
);

export type CreditTransaction = InferSchemaType<typeof creditTransactionSchema>;

export const CreditTransactionModel = model("CreditTransaction", creditTransactionSchema);
