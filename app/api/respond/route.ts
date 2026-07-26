import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendResponseEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      accepted,
      selectedDate,
      selectedTime,
      chosenVibe,
      chosenDateSpot,
      favoriteFood,
      replyMessage,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing invitation slug." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: invitation, error: findError } = await supabase
      .from("invitations")
      .select("id, invitater_id, invitationer_name")
      .eq("slug", slug)
      .single();

    if (findError || !invitation) {
      return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    }

    const { error: respondError } = await supabase
      .from("invitation_responses")
      .upsert(
        {
          invitation_id: invitation.id,
          accepted,
          selected_date: selectedDate || null,
          selected_time: selectedTime || null,
          chosen_vibe: chosenVibe || null,
          chosen_date_spot: chosenDateSpot || null,
          favorite_food: favoriteFood || null,
          reply_message: replyMessage || null,
        },
        { onConflict: "invitation_id" }
      );

    if (respondError) {
      return NextResponse.json({ error: respondError.message }, { status: 500 });
    }

    await supabase
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", invitation.invitater_id)
      .single();

    if (profile?.email) {
      await sendResponseEmail({
        toEmail: profile.email,
        invitaterName: profile.name,
        invitationerName: invitation.invitationer_name,
        accepted,
        selectedDate,
        selectedTime,
        chosenVibe,
        chosenDateSpot,
        favoriteFood,
        replyMessage,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
