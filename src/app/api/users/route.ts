import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Only email/name — never passwordHash or id — so the tracker UI can
// show "καταχωρήθηκε από" against the createdByEmail already stored
// on entries/contacts.
export async function GET() {
  const users = await db.user.findMany({
    select: { email: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users, { headers: { "Cache-Control": "no-store" } });
}
