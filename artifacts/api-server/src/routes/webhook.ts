/**
 * Module 6: Webhook Handling
 * Handles Meta's webhook verification handshake and incoming event payloads.
 * Register this URL in Meta's App Dashboard under WhatsApp > Configuration.
 * Set WEBHOOK_VERIFY_TOKEN in Replit Secrets to the same token you enter in Meta.
 */

import { Router } from "express";
import { MessageModel } from "../models/Message";
import { ContactModel } from "../models/Contact";
import { UserModel } from "../models/User";
import { CampaignModel } from "../models/Campaign";
import mongoose from "mongoose";
import { logger } from "../lib/logger";

const router = Router();

/** Strip all non-digit characters for phone comparison */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ── GET /api/webhook — Meta verification handshake ────────────────────────────

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"] as string | undefined;
  const token = req.query["hub.verify_token"] as string | undefined;
  const challenge = req.query["hub.challenge"] as string | undefined;

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    logger.warn("WEBHOOK_VERIFY_TOKEN is not set — webhook verification will fail");
    res.status(500).send("WEBHOOK_VERIFY_TOKEN not configured in Secrets");
    return;
  }

  if (mode === "subscribe" && token === verifyToken) {
    logger.info("Webhook verified by Meta");
    res.status(200).send(challenge);
  } else {
    logger.warn({ mode, token }, "Webhook verification failed — token mismatch");
    res.status(403).send("Forbidden");
  }
});

// ── POST /api/webhook — receive events from Meta ──────────────────────────────

router.post("/webhook", async (req, res) => {
  // Must acknowledge immediately; Meta will retry if we don't respond within 5s
  res.status(200).send("EVENT_RECEIVED");

  try {
    const body = req.body as WebhookBody;
    if (body?.object !== "whatsapp_business_account") return;

    const myPhoneNumberId = process.env.META_PHONE_NUMBER_ID;

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value || change.field !== "messages") continue;

        // Log phone_number_id for debugging but do not filter on it —
        // test payloads from Meta dashboard use "123456123" instead of the real ID.
        if (myPhoneNumberId && value.metadata?.phone_number_id &&
            value.metadata.phone_number_id !== myPhoneNumberId) {
          logger.info({ expected: myPhoneNumberId, got: value.metadata.phone_number_id },
            "Webhook phone_number_id differs from env (continuing anyway)");
        }

        // Handle incoming messages
        for (const msg of value.messages ?? []) {
          await handleIncomingMessage(msg, value.contacts ?? []).catch((err) =>
            logger.error({ err, msg }, "Error handling incoming message"),
          );
        }

        // Handle status updates (delivered, read, failed)
        for (const status of value.statuses ?? []) {
          await handleStatusUpdate(status).catch((err) =>
            logger.error({ err, status }, "Error handling status update"),
          );
        }
      }
    }
  } catch (err) {
    logger.error({ err }, "Unhandled webhook error");
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function handleIncomingMessage(
  msg: WebhookMessage,
  waContacts: WebhookContact[],
) {
  const fromRaw = msg.from; // digits only, no +, e.g. "919876543210"
  const fromNorm = normalizePhone(fromRaw);

  // Find a Contact whose normalized phone matches
  const allContacts = await ContactModel.find({}).lean();
  const contact = allContacts.find(
    (c) => normalizePhone(c.phone) === fromNorm,
  );

  let contactId: mongoose.Types.ObjectId;
  let userId: mongoose.Types.ObjectId;

  if (contact) {
    contactId = contact._id as mongoose.Types.ObjectId;
    userId = contact.userId as mongoose.Types.ObjectId;
  } else {
    // Auto-create contact for unknown senders — assign to the only/first user
    // In a multi-tenant production setup you'd match by WABA per user
    const waContact = waContacts.find((wc) => normalizePhone(wc.wa_id) === fromNorm);
    const displayName = waContact?.profile?.name ?? fromRaw;

    const firstUser = await UserModel.findOne().lean();
    if (!firstUser) {
      logger.warn({ fromRaw }, "No user found; skipping unknown sender");
      return;
    }

    userId = firstUser._id as mongoose.Types.ObjectId;

    const created = await ContactModel.create({
      userId,
      name: displayName,
      phone: `+${fromRaw}`,
    });
    contactId = created._id as mongoose.Types.ObjectId;
    logger.info({ phone: fromRaw, name: displayName }, "Auto-created contact from webhook");
  }

  // Extract text body (only handling text messages for now)
  const body =
    msg.type === "text"
      ? msg.text?.body
      : msg.type === "image"
        ? "[Image]"
        : msg.type === "document"
          ? "[Document]"
          : msg.type === "audio"
            ? "[Audio]"
            : `[${msg.type}]`;

  // Avoid duplicate messages
  const existing = await MessageModel.findOne({ whatsappMessageId: msg.id });
  if (existing) return;

  await MessageModel.create({
    userId,
    contactId,
    direction: "INBOUND",
    body,
    whatsappMessageId: msg.id,
    status: "RECEIVED",
  });

  // Update contact's lastContactedAt
  await ContactModel.findByIdAndUpdate(contactId, { lastContactedAt: new Date() });

  logger.info({ from: fromRaw, body }, "Stored incoming message");
}

async function handleStatusUpdate(status: WebhookStatus) {
  const update: Record<string, unknown> = { status: status.status.toUpperCase() };

  if (status.status === "delivered") update.deliveredAt = new Date(Number(status.timestamp) * 1000);
  if (status.status === "read") update.readAt = new Date(Number(status.timestamp) * 1000);
  if (status.status === "failed") {
    update.status = "FAILED";
    update.failureReason = status.errors?.[0]?.title ?? "Unknown error";
  }

  const msg = await MessageModel.findOneAndUpdate(
    { whatsappMessageId: status.id },
    { $set: update },
    { new: true },
  );

  if (!msg) return;

  // Propagate stats to campaign if applicable
  if (msg.campaignId && (status.status === "delivered" || status.status === "read" || status.status === "failed")) {
    const field =
      status.status === "delivered"
        ? "stats.delivered"
        : status.status === "read"
          ? "stats.read"
          : "stats.failed";
    await CampaignModel.findByIdAndUpdate(msg.campaignId, { $inc: { [field]: 1 } });
  }

  logger.info({ id: status.id, status: status.status }, "Updated message status");
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface WebhookBody {
  object: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value: WebhookValue;
    }>;
  }>;
}

interface WebhookValue {
  messaging_product: string;
  metadata?: { display_phone_number: string; phone_number_id: string };
  messages?: WebhookMessage[];
  statuses?: WebhookStatus[];
  contacts?: WebhookContact[];
}

interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string };
  document?: { id: string; filename?: string };
  audio?: { id: string };
}

interface WebhookStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string }>;
}

interface WebhookContact {
  profile?: { name: string };
  wa_id: string;
}

export default router;
