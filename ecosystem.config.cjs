module.exports = {
  apps: [
    {
      name: "airavata-api",
      script: "./artifacts/api-server/dist/index.mjs",
      cwd: "/var/www/airavata",          // change to wherever you clone the repo on VPS
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: "3014",

        // ── MongoDB ───────────────────────────────────────────────────────────
        MONGODB_URI: "PASTE_YOUR_MONGODB_URI_HERE",

        // ── Session ───────────────────────────────────────────────────────────
        SESSION_SECRET: "PASTE_YOUR_SESSION_SECRET_HERE",

        // ── Meta / WhatsApp ───────────────────────────────────────────────────
        META_ACCESS_TOKEN: "PASTE_YOUR_META_ACCESS_TOKEN_HERE",
        META_PHONE_NUMBER_ID: "PASTE_YOUR_META_PHONE_NUMBER_ID_HERE",
        META_WABA_ID: "PASTE_YOUR_META_WABA_ID_HERE",
        WEBHOOK_VERIFY_TOKEN: "PASTE_YOUR_WEBHOOK_VERIFY_TOKEN_HERE",
      },
    },
  ],
};
