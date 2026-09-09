import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB — stays under Vercel's serverless request body limit
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Δεν βρέθηκε αρχείο" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Το αρχείο είναι πολύ μεγάλο (μέγιστο 4MB)" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Επιτρέπονται μόνο PDF ή εικόνες (JPEG/PNG/WEBP/HEIC)" }, { status: 400 });
  }

  // This Blob store is configured for private access, so the stored url
  // is not directly fetchable by anyone — files are served back out
  // through /api/files/[id], which streams them via the SDK's get()
  // using our own read-write token, gated behind the normal session check.
  const blob = await put(file.name, file, {
    access: "private",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url, name: file.name });
}
