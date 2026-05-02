import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password: string };
  if (password === "acustega2026") {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 401 });
}
