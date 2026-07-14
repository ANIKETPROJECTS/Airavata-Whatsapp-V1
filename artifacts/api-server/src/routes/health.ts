import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { getConnectionState } from "../lib/mongodb";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Plain (non-generated) route to confirm the MongoDB connection is alive.
router.get("/healthz/db", (_req, res) => {
  const mongoState = getConnectionState();
  const ok = mongoState === "connected";
  res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "unavailable", mongo: mongoState });
});

export default router;
