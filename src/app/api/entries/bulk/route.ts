import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (!rows.length) return NextResponse.json({ inserted: 0 });

  const result = await db.entry.createMany({
    data: rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      projectId: r.projectId,
      date: new Date(r.date as string),
      lastName: r.lastName,
      firstName: r.firstName,
      afm: r.afm || null,
      supplyNumber: r.supplyNumber || null,
      contactInfo: r.contactInfo || null,
      contactPersonName: r.contactPersonName || null,
      description: r.description,
      status: "pending",
      partialNotes: [],
      createdByEmail: session?.email ?? null,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ inserted: result.count });
}
