import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Streams the attachment for one entry back to an authenticated viewer.
// The Blob store is private, so nobody can fetch the stored url directly —
// this is the only path through which a file ever leaves the store.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const entry = await db.entry.findUnique({ where: { id } });
  if (!entry || !entry.fileUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await get(entry.fileUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filename = entry.fileName || "attachment";
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
