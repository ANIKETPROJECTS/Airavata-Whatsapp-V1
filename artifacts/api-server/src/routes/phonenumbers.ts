/**
 * GET /api/phonenumbers
 * Fetches the phone number details registered to this WABA from Meta's Graph API.
 */
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

const GRAPH_BASE = "https://graph.facebook.com/v20.0";

router.get("/phonenumbers", authenticate, async (_req, res) => {
  const wabaId = process.env.META_WABA_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!wabaId || !accessToken) {
    return res.status(500).json({ error: "Meta credentials not configured" });
  }

  try {
    const resp = await fetch(
      `${GRAPH_BASE}/${wabaId}/phone_numbers?fields=display_phone_number,verified_name,quality_rating,messaging_limit_tier,status`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = (await resp.json()) as {
      data?: Array<{
        id: string;
        display_phone_number: string;
        verified_name: string;
        quality_rating: string;
        messaging_limit_tier: string;
        status: string;
      }>;
      error?: { message: string };
    };

    if (data.error) {
      return res.status(502).json({ error: data.error.message });
    }

    const numbers = (data.data ?? []).map((pn) => ({
      id: pn.id,
      number: pn.display_phone_number,
      verifiedName: pn.verified_name,
      quality: pn.quality_rating ?? "UNKNOWN",
      messagingTier: pn.messaging_limit_tier ?? "—",
      status: pn.status ?? "CONNECTED",
      verified: true,
    }));

    res.json({ numbers });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
