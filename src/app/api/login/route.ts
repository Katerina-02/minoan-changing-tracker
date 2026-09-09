import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  const fail = NextResponse.redirect(new URL("/login?error=1", request.url), 303);

  if (!email || !password) return fail;

  let user;
  try {
    user = await db.user.findUnique({ where: { email } });
  } catch {
    return fail;
  }
  if (!user) return fail;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return fail;

  await createSessionCookie({ userId: user.id, email: user.email, name: user.name });

  return NextResponse.redirect(new URL("/tracker", request.url), 303);
}
