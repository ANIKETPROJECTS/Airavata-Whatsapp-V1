/**
 * VPS build script – called by `npm run build`
 * Bootstraps pnpm (if needed), installs all workspace deps,
 * then builds the API server and the React frontend.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });
}

// ── 1. Ensure pnpm is available ───────────────────────────────────────────────
try {
  execSync("pnpm --version", { stdio: "ignore" });
  console.log("✔ pnpm already installed");
} catch {
  console.log("pnpm not found – installing via npm…");
  run("npm install -g pnpm");
}

// ── 2. Install all workspace dependencies ─────────────────────────────────────
run("pnpm install --no-frozen-lockfile");

// ── 3. Build API server (esbuild → dist/index.mjs) ───────────────────────────
run("pnpm --filter @workspace/api-server run build");

// ── 4. Build React frontend (vite → artifacts/airavata/dist/public) ───────────
run("pnpm --filter @workspace/airavata run build", {
  env: {
    ...process.env,
    NODE_ENV: "production",
    BASE_PATH: "/",      // nginx serves the app at the domain root
    PORT: "3001",        // vite build doesn't need a real port but the config validates it
  },
});

console.log("\n✅  Build complete!");
console.log("   API bundle : artifacts/api-server/dist/index.mjs");
console.log("   Frontend   : artifacts/airavata/dist/public/");
