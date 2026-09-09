import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const PATCHABLE_FIELDS = [
  "lastName",
  "firstName",
  "afm",
  "supplyNumber",
  "contactInfo",
  "contactPersonName",
  "description",
  "status",
  "partialNotes",
  "completedDate",
  "deletedDate",
  "deleteReason",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const field of PATCHABLE_FIELDS) {
    if (!(field in body)) continue;
    if (field === "completedDate" || field === "deletedDate") {
      data[field] = body[field] ? new Date(body[field]) : null;
    } else {
      data[field] = body[field];
    }
  }

  try {
    const row = await db.entry.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}
