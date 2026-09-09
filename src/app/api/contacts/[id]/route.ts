import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const field of ["lastName", "firstName", "afm", "contacts", "projectIds"] as const) {
    if (field in body) data[field] = body[field];
  }

  try {
    const row = await db.contact.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
}
