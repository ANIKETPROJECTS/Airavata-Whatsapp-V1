/**
 * Module 9: Credits & Billing
 * Exposes credit balance, transaction history, and manual top-up.
 * A real payment gateway (Razorpay/Stripe) will replace the manual top-up endpoint.
 */

import { Router } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { CreditTransactionModel } from "../models/CreditTransaction";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";

const router = Router();

// ── GET /api/billing ──────────────────────────────────────────────────────────
// Returns the user's current credit balance and recent transaction history.

router.get("/billing", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const user = await UserModel.findById(userId).select("creditBalance").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await CreditTransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      balance: user.creditBalance ?? 0,
      transactions: transactions.map((t) => ({
        id: String(t._id),
        type: t.type,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        description: t.description ?? null,
        campaignId: t.campaignId ? String(t.campaignId) : null,
        createdAt: t.createdAt,
      })),
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// ── POST /api/billing/add-credits ─────────────────────────────────────────────
// Manually add credits (development / admin use). Replace with payment gateway later.

router.post("/billing/add-credits", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);
    const { amount, description } = req.body as { amount: number; description?: string };

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({ error: "amount must be a positive integer" });
    }
    if (amount > 100_000) {
      return res.status(400).json({ error: "Maximum top-up is 100,000 credits at a time" });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: amount } },
      { new: true },
    ).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    await CreditTransactionModel.create({
      userId,
      type: "PURCHASE",
      amount,
      balanceAfter: user.creditBalance ?? 0,
      description: description ?? `Manual top-up of ${amount} credits`,
    });

    res.json({ balance: user.creditBalance ?? 0, added: amount });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
