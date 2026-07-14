/**
 * One-shot script: creates a simple UTILITY template on Meta + saves to MongoDB.
 * Run once from the project root:  node create-template.mjs
 */
import mongoose from "mongoose";

// ── Config ────────────────────────────────────────────────────────────────────
const MONGODB_URI     = process.env.MONGODB_URI;
const ACCESS_TOKEN    = process.env.META_ACCESS_TOKEN;
const WABA_ID         = process.env.META_WABA_ID;

if (!MONGODB_URI || !ACCESS_TOKEN || !WABA_ID) {
  console.error("Missing env vars: MONGODB_URI, META_ACCESS_TOKEN, META_WABA_ID");
  process.exit(1);
}

// ── Template payload ──────────────────────────────────────────────────────────
// UTILITY + no variables = fastest approval path
const TEMPLATE = {
  name: "support_reply",           // snake_case, lowercase only
  category: "UTILITY",
  language: "en",
  components: [
    {
      type: "BODY",
      text: "Thank you for reaching out! Our team has received your message and will respond within 24 hours.",
    },
  ],
};

// ── Step 1: Submit to Meta ────────────────────────────────────────────────────
console.log("Submitting template to Meta…");
const metaRes = await fetch(
  `https://graph.facebook.com/v22.0/${WABA_ID}/message_templates`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(TEMPLATE),
  },
);
const metaJson = await metaRes.json();
console.log("Meta response:", JSON.stringify(metaJson, null, 2));

if (metaJson.error) {
  console.error("Meta rejected the template:", metaJson.error.message);
  process.exit(1);
}

// ── Step 2: Save to MongoDB ───────────────────────────────────────────────────
console.log("\nConnecting to MongoDB…");
await mongoose.connect(MONGODB_URI);

// Find the most-recent user (the real account)
const User = mongoose.model(
  "User",
  new mongoose.Schema({ email: String }, { strict: false }),
);
const user = await User.findOne().sort({ createdAt: -1 }).lean();
if (!user) {
  console.error("No user found in MongoDB — have you registered?");
  process.exit(1);
}
console.log("Saving template for user:", user.email);

const Template = mongoose.model(
  "Template",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    category: String,
    language: String,
    headerType: String,
    body: String,
    status: String,
    metaTemplateId: String,
  }, { timestamps: true }),
);

// Upsert so re-running is safe
await Template.findOneAndUpdate(
  { name: TEMPLATE.name, userId: user._id },
  {
    userId: user._id,
    name: TEMPLATE.name,
    category: TEMPLATE.category,
    language: TEMPLATE.language,
    headerType: "NONE",
    body: TEMPLATE.components[0].text,
    status: metaJson.status ?? "PENDING",
    metaTemplateId: metaJson.id ?? "",
  },
  { upsert: true, new: true },
);

console.log("\n✅  Template saved!");
console.log("   Name   :", TEMPLATE.name);
console.log("   Status :", metaJson.status ?? "PENDING");
console.log("   Meta ID:", metaJson.id ?? "(none)");
console.log("\nRefresh the Manage Templates page — it will appear there.");

await mongoose.disconnect();
