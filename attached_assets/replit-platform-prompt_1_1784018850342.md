# Replit Prompt: Airavata WhatsApp Business API Platform

Copy everything below into Replit as your starting prompt for a fresh account/project.

---

## Project Overview

Build a full SaaS platform called **"Airavata WhatsApp Solution"** — a dashboard that lets businesses manage WhatsApp Business API messaging: sending campaigns, managing templates, live chat with customers, contact management, chatbots, and more.

**This is being built in two clear stages, and right now we are only doing Stage 1:**

- **Stage 1 (build this now):** Front-end UI only. Every page, section, and feature should be fully designed and navigable, using realistic mock/dummy data. No real backend logic, no real database connection, no real API calls to WhatsApp/Meta yet. All actions (buttons, forms, toggles) should work visually — show loading states, success/error toasts, modals — using local/in-memory state only.
- **Stage 2 (later, one feature at a time):** I will come back and ask you to wire up real functionality piece by piece — starting with the database, then authentication, then one feature module at a time (e.g., "now make Contacts actually save to the database," "now make Add Template actually submit to Meta's API"). Do not build any of this yet.

## Critical Technical Constraint: Database

**The only database allowed for this project, now or later, is MongoDB.** Do not use PostgreSQL, MySQL, SQLite, Firebase, Supabase, or any other database or backend-as-a-service, even temporarily, even for convenience, even if it seems easier to scaffold. If Replit's default project template assumes a different database, override it or ask me before proceeding.

For this Stage 1 UI-only build, you don't need to connect to MongoDB at all — just make sure that:
- No other database gets auto-installed or auto-configured in the background
- Any mock "data layer" you build for the UI is structured simply enough (arrays/objects of records) that it can be swapped for real MongoDB documents later without redesigning the UI
- If you scaffold any backend/server files at all in this stage, keep them minimal and don't install any database driver except one that supports MongoDB (e.g., leave a placeholder/comment for where MongoDB will be connected later, rather than installing an unrelated ORM/driver)

## Design & Layout Requirements

- Left sidebar navigation, dark background, with a logo at the top and a "Profile" section pinned at the bottom.
- Top of main content area shows a "Welcome Back, [Business Name]" bar.
- Modern SaaS dashboard aesthetic: light content area, card-based layout with soft shadows and rounded corners, a primary brand color, with distinct accent colors (purple/blue/green/red) for stat cards.
- Fully responsive: sidebar collapses to a hamburger drawer on mobile/tablet.
- Consistent topbar with global search, notification bell, and account dropdown.
- Skeleton loaders/shimmer placeholders on page load for realism.
- Empty states (illustration + helpful message + action button) wherever a list could be empty.
- Toast notifications (success/error/info) triggered by mock actions.
- Use a modern, consistent icon set throughout.

## Sidebar Navigation (in this order)

1. Dashboard
2. Live Chat
3. Contacts
4. Create Campaign
5. Campaigns Report
6. Add Template
7. Manage Templates
8. Manage
9. Flow Builder
10. Chatbot
11. Integration
12. Group
13. Catalogue
14. WA Pay
15. Profile (bottom, separated from main nav)

---

## Page-by-Page Feature Requirements

### 1. Dashboard
- Welcome banner with business name badge.
- Onboarding card: "Setup free WhatsApp Business Account" prompt with a "Continue with Facebook" style button and an embedded demo video thumbnail (placeholder).
- Two secondary buttons: "Schedule Demo" and "Login with Facebook" (mock modals on click).
- "Download Latest Mobile APK" card with a benefits checklist and a "Download APK" button (mock).
- Four stat cards: Sent, Delivered, Read, Failed — big number, icon, distinct color each.
- "Overall Message Distribution" section with a month/week/year filter dropdown and a bar/line chart (mock data).
- "Sent" trend chart card with its own filter dropdown.
- Recent Campaigns table: Campaign Name, Template, Status badge, Total Count, with a Refresh button and empty state.
- Floating WhatsApp-style chat bubble icon in the bottom-right corner (visual only).

### 2. Live Chat
- Three-pane layout:
  - Left: searchable conversation list (name, last message preview, unread badge, timestamp), with filter tabs (All, Unread, Assigned to Me, Resolved).
  - Middle: active chat window with message bubbles (sent/received styling), timestamps, read receipts, message input with attachment/emoji/quick-reply icons, Send button.
  - Right (collapsible): contact details panel — name, phone, tags, notes, conversation summary.
- Visual indicator for the 24-hour customer service messaging window (open/closed).

### 3. Contacts
- Table view: Name, Phone Number, Tags, Group, Last Contacted, Status.
- Search bar, tag/group filter dropdown, bulk action checkboxes (Add to Group, Add Tag, Delete, Export).
- "Add Contact" modal (Name, Phone, Email, Tags, Group).
- "Import Contacts" button with mock CSV upload UI and a sample template download link.
- Pagination controls.

### 4. Create Campaign
- Multi-step wizard with a progress indicator:
  1. Campaign name + template selection (with preview thumbnail).
  2. Audience selection — contacts, groups, or CSV upload, with live recipient counter.
  3. Template variable form with a live WhatsApp-style message preview that updates as fields are filled.
  4. Schedule — "Send Now" or "Schedule for Later" (date/time picker).
  5. Review & confirm screen with estimated credit cost, then "Launch Campaign" button.

### 5. Campaigns Report
- Summary stat cards (Total Campaigns, Total Sent, Avg. Delivery Rate, Avg. Read Rate).
- Table: Name, Template Used, Date, Sent, Delivered, Read, Failed, Status badge.
- Row click opens a detail drawer/modal with per-recipient breakdown and a mini funnel chart (Sent → Delivered → Read → Failed).
- Export button (mock CSV/PDF).
- Date range and status filters.

### 6. Add Template
- Form: Template name, category (Marketing/Utility/Authentication), language selector.
- Header type selector (None/Text/Image/Video/Document).
- Body text area with "insert variable" button ({{1}}, {{2}}, etc.).
- Footer text (optional).
- Buttons builder: up to 3 buttons (Quick Reply, CTA-URL, CTA-Phone), each with its own mini config.
- Live preview panel on the right showing a realistic WhatsApp message bubble updating live.
- "Submit for Approval" button with a mock "Pending Approval" state after submission.

### 7. Manage Templates
- Grid/table of templates with WhatsApp-bubble-style preview thumbnails.
- Status badges: Approved (green), Pending (yellow), Rejected (red, with reason on hover/click).
- Actions: Edit, Duplicate, Delete, View Details.
- Search and filter by status/category.

### 8. Manage
- Tabbed/accordion settings page:
  - Phone Numbers: connected numbers with status, quality rating, messaging tier.
  - API Keys: masked key values, "Generate New Key," "Revoke."
  - Team Members: invite/manage users with roles (Admin, Agent, Viewer).
  - Tags: manage custom tags.
  - Billing/Credits: current balance, usage history, "Buy Credits" button.

### 9. Flow Builder
- Drag-and-drop node-based canvas for chatbot flows.
- Left palette: Send Message, Ask Question, Condition/Branch, Button Menu, List Menu, API Call, Delay, End Flow.
- Pre-placed sample nodes connected to demonstrate the concept.
- Top toolbar: Save, Test Flow, Zoom controls, Undo/Redo.
- Clicking a node opens a config side panel.

### 10. Chatbot
- List of chatbots/auto-reply rules with Active/Inactive toggles.
- "Create Chatbot" form: trigger keywords, welcome message, fallback message, business hours auto-reply, link to a Flow Builder flow.
- Test/preview chat widget showing mock bot responses.

### 11. Integration
- Grid of integration cards (Shopify, WooCommerce, Zapier, Google Sheets, HubSpot, Salesforce, Webhooks, Razorpay/Stripe) each with a "Connect" button opening a mock credentials modal.
- Dedicated Webhooks section: copyable webhook URL field, event type checkboxes.

### 12. Group
- List of contact groups: name, member count, created date.
- "Create Group" modal.
- Group detail view with member list and add/remove actions.

### 13. Catalogue
- Product grid: image, name, price, description, "Add Product" button.
- Product form modal: image upload UI, name, price, description, SKU, category.
- Toggle for catalogue visibility on WhatsApp profile.

### 14. WA Pay
- Payment settings page: connect payment provider (mock), transaction history table (Date, Customer, Amount, Status), summary card for total collected.
- Toggle to enable "Pay" buttons inside templates.

### 15. Profile
- Account settings: profile photo upload, business name, email, phone, timezone, password change form.
- Notification preference toggles.
- "Logout" button.

---

## Additional Global UI Elements

- Global search bar in the topbar (mock filtering across contacts, templates, campaigns).
- Notifications dropdown with sample mock alerts.
- Onboarding checklist widget on first load (Connect WhatsApp Number → Create Template → Add Contacts → Launch Campaign), collapsible.
- Dark mode toggle (nice to have) in topbar or profile menu.
- Every page has a clear title/header and breadcrumb where relevant.

## Mock Data Requirements

Populate every table, chart, and list with realistic sample data (Indian names and +91 phone numbers are appropriate) so nothing looks empty:
- At least 8–10 rows per table
- 3–5 sample templates in different statuses
- 3–4 sample campaigns with varying stats
- A few weeks of chart data for the dashboard graphs

## Structure Notes for Future Integration (Important — read carefully)

Even though we are not connecting any backend or database in this stage, please structure the project so that Stage 2 work is easy to layer in later:

- Keep each page/feature's mock data clearly separated (e.g., its own file or clearly labeled section) rather than scattered inline, so it's obvious what will later be replaced by a real MongoDB query.
- Keep UI components and "data-fetching" logic loosely separated, even if the data-fetching is currently just returning mock arrays — this way, swapping mock functions for real MongoDB-backed API calls later doesn't require rebuilding the UI.
- Do not hardcode any assumption that ties the data layer to a non-MongoDB database. Avoid any auto-generated boilerplate that assumes a SQL schema, Firebase config, or similar.
- Leave a short comment at the top of any file where a future backend connection will plug in (e.g., "// This will later fetch from MongoDB via our backend API") so it's easy for us to find these spots in Stage 2.

## What NOT to Build Right Now

- No real authentication/login logic (a visual login/signup screen is fine, but it doesn't need to actually authenticate anyone)
- No real database connection of any kind
- No real calls to Meta's WhatsApp API
- No real payment processing
- No real file storage/upload handling (just UI for it)

---

Build this as a fully navigable multi-page prototype where every sidebar item leads to a real, styled, feature-complete page as described above — not placeholder "coming soon" screens. Once this is done, I will guide you through adding real functionality one feature at a time, starting with the MongoDB connection.
