"use client";

interface Props {
  inviteUrl: string;
  invitationerName: string;
  className?: string;
}

export default function WhatsappShareButton({
  inviteUrl,
  invitationerName,
  className,
}: Props) {
  const message = `Hey ${invitationerName}, I made a special secret invitation just for you 💌\nOpen this link if you dare 👉 ${inviteUrl}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
      }
    >
      <WhatsappIcon />
      Send via WhatsApp
    </a>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.93L2 22l5.31-1.39a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.86 14.03c-.25.7-1.45 1.34-2 1.42-.51.08-1.15.11-1.86-.12-.43-.13-.98-.31-1.68-.6-2.96-1.28-4.89-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.66.51.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.18-.3.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.72.82 2.02.97.3.15.5.22.57.35.08.13.08.75-.17 1.45Z" />
    </svg>
  );
}
