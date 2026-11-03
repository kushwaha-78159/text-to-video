import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 100 * 1024 * 1024;
const allowed = new Set([
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "video/mp4", "video/webm", "application/pdf",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const config = [
    process.env.S3_ENDPOINT, process.env.S3_PUBLIC_URL, process.env.S3_ACCESS_KEY_ID,
    process.env.S3_SECRET_ACCESS_KEY, process.env.S3_BUCKET,
  ];
  if (config.some((value) => !value)) {
    return NextResponse.json({ error: "Cloud storage is not fully configured." }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select a file." }, { status: 400 });
    }
    if (file.size < 1 || file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File must be smaller than 100 MB." }, { status: 400 });
    }
    if (!allowed.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
    }

    const client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const key = `users/${session.id}/${randomUUID()}-${safeName}`;
    await client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }));

    const base = process.env.S3_PUBLIC_URL!;
    const url = `${base.replace(/\/$/, "")}/${key}`;
    return NextResponse.json({ success: true, key, url, name: file.name, size: file.size });
  } catch (error) {
    console.error("Cloud upload failed:", error);
    return NextResponse.json({ error: "Cloud upload failed. Check storage credentials and bucket permissions." }, { status: 502 });
  }
}
