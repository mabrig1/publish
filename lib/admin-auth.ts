import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "publishai_admin";

function configuredSecret() {
  return process.env.ADMIN_ACCESS_KEY?.trim() || "";
}

export function adminSessionToken() {
  const secret = configuredSecret();
  if (!secret) return "";
  return createHash("sha256").update(`mabrig-publishai:${secret}`).digest("hex");
}

export function adminAuthConfigured() {
  return Boolean(configuredSecret());
}

export function verifyAdminKey(candidate: string) {
  const expected = configuredSecret();
  if (!expected || !candidate) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function hasAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value || "";
  const expected = adminSessionToken();
  return Boolean(expected && token === expected);
}

export function requestHasAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || "";
  const expected = adminSessionToken();
  return Boolean(expected && token === expected);
}
