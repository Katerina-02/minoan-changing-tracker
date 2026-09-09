import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Multiple people poll these endpoints for live changes — never let the
// platform or a browser cache a stale response.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }
  const rows = await db.entry.findMany({
    where: { projectId },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();

  const required = ["id", "projectId", "date", "lastName", "firstName", "supplyNumber", "description"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const row = await db.entry.create({
    data: {
      id: body.id,
      projectId: body.projectId,
      date: new Date(body.date),
      lastName: body.lastName,
      firstName: body.firstName,
      afm: body.afm || null,
      supplyNumber: body.supplyNumber || null,
      contactInfo: body.contactInfo || null,
      contactPersonName: body.contactPersonName || null,
      description: body.description,
      status: "pending",
      partialNotes: [],
      createdByEmail: session?.email ?? null,
    },
  });
  return NextResponse.json(row);
}
