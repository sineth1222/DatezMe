import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(request: Request) {
  try {
    const { toEmail, invitationerName, inviteUrl, senderName } = await request.json();

    if (!toEmail || !inviteUrl) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: `${senderName || "Someone"} sent you a secret invitation 💌`,
      html: `
        <div style="font-family:Georgia,serif;background:#FFF3E4;padding:32px;text-align:center;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;">
            <p style="font-size:40px;margin:0;">💌</p>
            <h1 style="color:#6B1E3C;font-size:22px;">Hi ${invitationerName || ""},</h1>
            <p style="color:#2B1620;">Someone made a special secret invitation just for you.</p>
            <a href="${inviteUrl}" style="display:inline-block;margin-top:16px;background:#FF5C8A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
              Open Your Invitation
            </a>
          </div>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
