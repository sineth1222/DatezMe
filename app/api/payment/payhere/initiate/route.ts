import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePayHereHash } from "@/lib/payhere";

// Fixed price for removing the watermark — change to whatever you charge.
const WATERMARK_REMOVAL_PRICE = 300; // LKR
const CURRENCY = "LKR";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { invitationId } = await req.json();
  if (!invitationId) {
    return NextResponse.json(
      { error: "Missing invitationId" },
      { status: 400 },
    );
  }

  // Confirm this invitation actually belongs to the signed-in user.
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("id, slug, invitater_id")
    .eq("id", invitationId)
    .eq("invitater_id", user.id)
    .single();

  if (error || !invitation) {
    return NextResponse.json(
      { error: "Invitation not found" },
      { status: 404 },
    );
  }

  const orderId = `wm-${invitation.id}-${Date.now()}`;
  const hash = generatePayHereHash({
    orderId,
    amount: WATERMARK_REMOVAL_PRICE,
    currency: CURRENCY,
  });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return NextResponse.json({
    merchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
    orderId,
    amount: WATERMARK_REMOVAL_PRICE,
    currency: CURRENCY,
    hash,
    returnUrl: `${siteUrl}/create/success?slug=${invitation.slug}`,
    cancelUrl: `${siteUrl}/create/success?slug=${invitation.slug}`,
    notifyUrl: `${siteUrl}/api/payment/payhere/notify`,
  });
}
