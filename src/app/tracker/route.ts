import { readFileSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";

const TEMPLATE_PATH = path.join(process.cwd(), "src/app/tracker/content.html");
const PLACEHOLDER = 'const CURRENT_USER = {"name":"","email":""};';

export async function GET() {
  const session = await getSession();
  const html = readFileSync(TEMPLATE_PATH, "utf-8");

  const userJson = JSON.stringify({
    name: session?.name ?? "",
    email: session?.email ?? "",
  }).replace(/</g, "\\u003c");

  const withUser = html.replace(PLACEHOLDER, `const CURRENT_USER = ${userJson};`);

  return new Response(withUser, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
