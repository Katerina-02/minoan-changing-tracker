import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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

// Permanent delete is only ever offered in the UI for already
// soft-deleted entries (status "deleted") — enforce that here too,
// so a stray API call can't hard-delete an active request.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db.entry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  if (existing.status !== "deleted") {
    return NextResponse.json(
      { error: "Only already-deleted entries can be permanently deleted" },
      { status: 400 }
    );
  }

  await db.entry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
