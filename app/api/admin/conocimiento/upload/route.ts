import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const BUCKET = "acustega-knowledge";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files    = formData.getAll("files") as File[];
  const prefix   = (formData.get("prefix") as string | null) ?? "general";

  if (!files.length) {
    return Response.json({ urls: [] });
  }

  const supabase = adminClient();

  // Create bucket if it doesn't exist yet (idempotent)
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  const urls: string[] = [];

  for (const file of files) {
    const ext  = file.name.split(".").pop() ?? "bin";
    const slug = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${prefix}/${slug}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
  }

  return Response.json({ urls });
}
