import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminAuthConfigured, adminSessionToken, verifyAdminKey } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin access is not configured. Set ADMIN_ACCESS_KEY in the server environment." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const key = String(body.key ?? "");
  if (!verifyAdminKey(key)) {
    return NextResponse.json({ error: "Invalid admin access key." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
