import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import { database, databaseConfigured } from "../lib/database.js";
import { requireAdmin, sessionCookie, sessionToken, verifyAdminKey } from "../lib/auth.js";

const app = express();
const frontendOrigins = (process.env.FRONTEND_URL || "https://publisher.mabrigkorie.org")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || frontendOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origin is not permitted."));
  },
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => res.json({ service: "Mabrig PublishAI Backend", ok: true }));

app.get("/api/health", async (_req, res) => {
  const started = Date.now();
  if (!databaseConfigured()) return res.status(503).json({ ok: false, database: "not-configured" });
  try {
    await (await database()).command({ ping: 1 });
    res.json({ ok: true, database: "connected", latencyMs: Date.now() - started });
  } catch (error) {
    res.status(503).json({ ok: false, database: "unreachable", detail: error instanceof Error ? error.message : "Connection failed" });
  }
});

app.post("/api/session", (req, res) => {
  if (!verifyAdminKey(req.body?.key)) return res.status(401).json({ error: "Invalid admin access key." });
  res.cookie(sessionCookie, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ ok: true });
});

app.delete("/api/session", (_req, res) => {
  res.clearCookie(sessionCookie, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
  res.json({ ok: true });
});

const statuses = new Set(["New", "In technical review", "Awaiting client", "Ready to submit", "Visibility monitoring"]);

app.get("/api/jobs", requireAdmin, async (_req, res) => {
  try {
    const jobs = await (await database()).collection("jobs").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray();
    res.set("Cache-Control", "no-store").json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to load client jobs." });
  }
});

app.post("/api/jobs", requireAdmin, async (req, res) => {
  try {
    const clientName = String(req.body?.clientName || "").trim();
    const title = String(req.body?.title || "").trim();
    if (!clientName || !title) return res.status(400).json({ error: "Client name and manuscript title are required." });
    const job = {
      ...req.body,
      id: String(req.body.id || randomUUID()),
      clientName,
      title,
      status: statuses.has(req.body.status) ? req.body.status : "New",
      createdAt: String(req.body.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString(),
    };
    delete job._id;
    await (await database()).collection("jobs").updateOne({ id: job.id }, { $set: job }, { upsert: true });
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to save client job." });
  }
});

app.patch("/api/jobs/:id", requireAdmin, async (req, res) => {
  try {
    const updates = { updatedAt: new Date().toISOString() };
    if (statuses.has(req.body.status)) updates.status = req.body.status;
    for (const key of ["articleUrl", "doi", "latestScholarAudit", "latestHighImpactAssessment"]) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Array.isArray(req.body.scholarAudits)) updates.scholarAudits = req.body.scholarAudits.slice(-50);
    if (Array.isArray(req.body.highImpactHistory)) updates.highImpactHistory = req.body.highImpactHistory.slice(0, 20);
    const job = await (await database()).collection("jobs").findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { returnDocument: "after", projection: { _id: 0 } },
    );
    if (!job) return res.status(404).json({ error: "Client job not found." });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to update client job." });
  }
});

app.use((error, _req, res, _next) => res.status(400).json({ error: error instanceof Error ? error.message : "Request failed." }));

export default app;
