# Replit Prompt 2: Backend, Database & WhatsApp API Integration

Use this prompt only after the Stage 1 UI-only build (Prompt 1) is complete and you're happy with how it looks and navigates. Paste this into the same Replit project as a follow-up instruction.

---

## Context

The UI for "Airavata WhatsApp Solution" is already built with mock data across all pages (Dashboard, Live Chat, Contacts, Create Campaign, Campaigns Report, Add Template, Manage Templates, Manage, Flow Builder, Chatbot, Integration, Group, Catalogue, WA Pay, Profile).

We are now moving to Stage 2: connecting real functionality. **Do this incrementally, in the order below — do not jump ahead or build multiple modules at once.** After each module, stop and let me test it before continuing to the next.

## Non-Negotiable Technical Constraint

**MongoDB is the only database for this project.** Do not install, configure, or default to any other database (no PostgreSQL, MySQL, SQLite, Firebase, Supabase, etc.), even temporarily. Use the official MongoDB driver or Mongoose (or Replit's built-in MongoDB support if available) — nothing else.

All secrets (database connection string, API keys, tokens) must be stored using Replit's Secrets/environment variable manager — never hardcoded directly into any file.

---

## Module 1: Database Connection

- Set up a MongoDB connection (I will provide a MongoDB Atlas connection string, or we'll provision one together — ask me for it if you need it, don't generate a fake one).
- Store the connection string as a secret, not in code.
- Design collections for: users, contacts, groups, tags, templates, campaigns, messages/message logs, api_keys, credits/billing records.
- Confirm the connection works with a simple test (e.g., a basic health-check route or startup log) before moving to Module 2.

**Stop here and let me confirm the connection is working before continuing.**

## Module 2: Authentication

- Build real sign-up/login functionality: email + password, with secure password hashing (never store plain-text passwords).
- Store user accounts in MongoDB.
- Add session handling or token-based auth (e.g., JWT) so logged-in users stay logged in appropriately.
- Connect this to the existing login/signup UI screens from Stage 1 — don't rebuild the UI, just wire it up.
- Add basic protected-route logic so pages inside the dashboard aren't accessible without being logged in.

**Stop here and let me test creating an account and logging in before continuing.**

## Module 3: API Key System

- Generate a unique API key per user account, stored securely in MongoDB (hashed or encrypted, not plain text, similar to how passwords are handled).
- Wire this up to the "API Keys" section under the Manage page: "Generate New Key" and "Revoke" should now perform real actions against the database instead of mock behavior.

**Stop here and let me test generating and revoking a key before continuing.**

## Module 4: Contacts, Groups & Tags

- Wire up the Contacts, Group, and Manage → Tags pages to real MongoDB collections.
- Add Contact, Import Contacts (CSV parsing into real records), Add to Group, Add Tag, Delete, and Export should all perform real database operations.
- Replace all mock data on these pages with real data fetched from MongoDB for the logged-in user's account only (make sure one user can never see another user's contacts).

**Stop here and let me test adding, editing, and deleting contacts before continuing.**

## Module 5: WhatsApp API Connection (Test Credentials)

This is where we connect to Meta's WhatsApp Cloud API for real, using my test credentials (I'll provide the Phone Number ID, WhatsApp Business Account ID, and access token as secrets).

- Build a backend service that can send a template message via Meta's Graph API using these test credentials.
- Wire up the "Add Template" page: fetching existing templates, and creating/submitting new templates, using the real API instead of mock data.
- Wire up "Manage Templates" to show real approval statuses pulled from Meta.

**Stop here and let me test sending one real template message through the dashboard before continuing.**

## Module 6: Webhook Handling

- Build a webhook endpoint on the backend that Meta can call for message status updates and incoming messages.
- Handle Meta's webhook verification handshake correctly (it sends a challenge request first that must be echoed back properly).
- Store incoming events (delivery status, read receipts, incoming replies) in MongoDB, linked to the relevant campaign/contact/conversation.
- I will need to deploy this somewhere reachable (or use Replit's deployment/public URL) before registering the webhook URL in Meta's dashboard — let me know once this endpoint is ready so I can do that step.

**Stop here and let me confirm webhook events are being received and stored before continuing.**

## Module 7: Live Chat (Real-Time)

- Wire up the Live Chat page to real conversation data stored in MongoDB (populated by Module 6's incoming webhook events).
- Sending a reply from the Live Chat UI should call the WhatsApp API for real and store the sent message.
- Add real-time updates (e.g., via WebSockets or polling) so new incoming messages appear without a manual refresh.

**Stop here and let me test a full back-and-forth conversation before continuing.**

## Module 8: Create Campaign & Campaigns Report

- Wire up Create Campaign to actually send template messages to selected contacts/groups via the WhatsApp API, respecting the credit-per-recipient logic.
- Store campaign records and per-recipient send results in MongoDB.
- Wire up Campaigns Report to pull real statistics (sent/delivered/read/failed) from stored message logs and webhook updates.
- Wire up the Dashboard's stat cards and charts to pull from real data instead of mock data.

**Stop here and let me test launching a small real campaign before continuing.**

## Module 9: Credits & Billing

- Add a credit balance field per user in MongoDB, deducted automatically per message sent (matching the "1 credit per recipient" logic).
- Wire up a payment gateway (I'll tell you which one — Razorpay, Stripe, etc. — once we reach this step) to let users purchase credits.
- Wire up the Billing/Credits section under Manage to show real balance and usage history.

**Stop here and let me test a credit purchase and confirm deduction on send before continuing.**

## Module 10: Remaining Modules (Chatbot, Flow Builder, Integration, Catalogue, WA Pay)

Once Modules 1–9 are solid, we'll go through these one at a time in a follow-up prompt — each of these depends on the core messaging pipeline already working correctly, so we're deliberately saving them for last.

---

## Rules to Follow Throughout

- **One module at a time.** Do not start the next module until I've confirmed the current one works.
- **Never hardcode secrets.** Always use Replit's Secrets manager for API keys, tokens, and the database connection string.
- **Preserve the existing UI.** Wire up real functionality to the components/pages already built in Stage 1 — don't redesign pages while adding backend logic unless something is genuinely broken.
- **Data isolation.** Every user's data (contacts, templates, campaigns, messages) must be scoped to their own account — never shared across users unless a feature explicitly requires it (like shared team access, which we haven't built yet).
- **Ask before assuming.** If a step needs a credential, API key, or decision from me (e.g., "which payment gateway," "what's the MongoDB connection string"), stop and ask rather than inventing a placeholder and moving forward.
