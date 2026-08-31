import { NextRequest, NextResponse } from "next/server";
import { verifyPayHereNotification } from "@/lib/payhere";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * PayHere calls this server-to-server after a payment attempt — the only
 * trustworthy signal that payment actually succeeded. Never trust a
 * client-side "payment succeeded" callback alone for something this
 * consequential.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const params = Object.fromEntries(form.entries()) as Record<string, string>;

  const valid = verifyPayHereNotification({
    merchant_id: params.merchant_id,
    order_id: params.order_id,
    payhere_amount: params.payhere_amount,
    payhere_currency: params.payhere_currency,
    status_code: params.status_code,
    md5sig: params.md5sig,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // status_code "2" means the payment succeeded — see PayHere's docs.
  if (params.status_code !== "2") {
    return NextResponse.json({ ok: true });
  }

  const invitationId = params.order_id.split("-")[1]; // order_id = `wm-<invitationId>-<timestamp>`

  const supabase = createServiceClient();
  await supabase
    .from("invitations")
    .update({ has_watermark: false })
    .eq("id", invitationId);

  return NextResponse.json({ ok: true });
}
