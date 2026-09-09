import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Multiple people poll these endpoints for live changes — never let the
// platform or a browser cache a stale response.
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.contact.findMany({ orderBy: { lastName: "asc" } });
  return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();

  if (!body.id || !body.lastName || !body.firstName) {
    return NextResponse.json({ error: "id, lastName and firstName are required" }, { status: 400 });
  }

  const row = await db.contact.create({
    data: {
      id: body.id,
      lastName: body.lastName,
      firstName: body.firstName,
      afm: body.afm || null,
      contacts: body.contacts ?? [],
      projectIds: body.projectIds ?? [],
      createdByEmail: session?.email ?? null,
    },
  });
  return NextResponse.json(row);
}
