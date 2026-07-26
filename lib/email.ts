import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface ResponseEmailPayload {
  toEmail: string;
  invitaterName: string;
  invitationerName: string;
  accepted: boolean;
  selectedDate?: string | null;
  selectedTime?: string | null;
  chosenVibe?: string | null;
  chosenDateSpot?: string | null;
  favoriteFood?: string | null;
  replyMessage?: string | null;
}

export async function sendResponseEmail(payload: ResponseEmailPayload) {
  const {
    toEmail,
    invitaterName,
    invitationerName,
    accepted,
    selectedDate,
    selectedTime,
    chosenVibe,
    chosenDateSpot,
    favoriteFood,
    replyMessage,
  } = payload;

  const html = `
  <div style="font-family:Georgia,serif;background:#FFF3E4;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(107,30,60,0.15);">
      <div style="background:#6B1E3C;padding:28px 24px;text-align:center;">
        <p style="margin:0;color:#F7D9E3;letter-spacing:2px;font-size:12px;text-transform:uppercase;">HithaLink</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:24px;">${
          accepted ? "She/He said YES! 💖" : "A reply has arrived"
        }</h1>
      </div>
      <div style="padding:28px 24px;color:#2B1620;">
        <p style="font-size:16px;">Hi ${invitaterName},</p>
        <p style="font-size:16px;line-height:1.6;">
          <strong>${invitationerName}</strong> just responded to your invitation on HithaLink.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:15px;">
          ${row("Date", selectedDate)}
          ${row("Time", selectedTime)}
          ${row("Vibe", chosenVibe)}
          ${row("Date spot", chosenDateSpot)}
          ${row("Favorite food", favoriteFood)}
        </table>
        ${
          replyMessage
            ? `<div style="margin-top:20px;padding:16px;background:#F7D9E3;border-radius:12px;">
                <p style="margin:0;font-style:italic;color:#6B1E3C;">"${escapeHtml(
                  replyMessage
                )}"</p>
              </div>`
            : ""
        }
        <p style="margin-top:24px;font-size:14px;color:#8C3357;">
          Open your dashboard to see the full response and plan the date.
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
           style="display:inline-block;margin-top:12px;background:#FF5C8A;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">
          Open Dashboard
        </a>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: accepted
      ? `${invitationerName} said YES on HithaLink 💖`
      : `${invitationerName} replied on HithaLink`,
    html,
  });
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;color:#8C3357;width:140px;">${label}</td>
    <td style="padding:6px 0;font-weight:600;">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
