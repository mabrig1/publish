import { createHash, timingSafeEqual } from "node:crypto";

export const sessionCookie = "publishai_backend_session";

function secret() {
  return process.env.ADMIN_ACCESS_KEY?.trim() || "";
}

export function sessionToken() {
  return secret() ? createHash("sha256").update(`publishai-backend:${secret()}`).digest("hex") : "";
}

export function verifyAdminKey(candidate = "") {
  const expected = Buffer.from(secret());
  const supplied = Buffer.from(String(candidate));
  return expected.length > 0 && expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export function requireAdmin(req, res, next) {
  const expected = sessionToken();
  const supplied = req.cookies?.[sessionCookie] || "";
  if (!expected || supplied !== expected) return res.status(401).json({ error: "Unauthorized." });
  next();
}
