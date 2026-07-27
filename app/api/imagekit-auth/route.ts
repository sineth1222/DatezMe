import { NextResponse } from "next/server";
import crypto from "crypto";

// Without this, Next.js may statically cache this GET route at build time
// (since it has no obvious per-request data source), freezing the same
// token/expire/signature for every request until the next deploy — which
// eventually makes ImageKit reject the (now stale) expire value.
export const dynamic = "force-dynamic";

// ImageKit's client-side (browser) upload flow needs a short-lived
// token + signature generated on the server, so the private key never
// reaches the browser. The client fetches this, then uploads directly
// to ImageKit using the public key + these values.
export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return NextResponse.json(
      { error: "IMAGEKIT_PRIVATE_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60; // valid 30 minutes

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return NextResponse.json({ token, expire, signature });
}
