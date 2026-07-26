"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Mail } from "lucide-react";
import WhatsappShareButton from "@/components/WhatsappShareButton";
import FloatingHearts from "@/components/FloatingHearts";

function SuccessContent() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = `${origin}/invite/${slug}`;
  const invitationerName = slug.split("-").slice(0, -1).join(" ") || "them";

  const sendByEmail = async () => {
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: partnerEmail,
          invitationerName: capitalize(invitationerName),
          inviteUrl,
        }),
      });
      if (!res.ok) throw new Error();
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative font-display flex min-h-screen items-center justify-center overflow-hidden bg-vanilla bg-wine-glow bg-noise px-4">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-rosegold/30 bg-white/70 p-8 text-center shadow-xl backdrop-blur-md">
        {/* ── Background logo watermark ── */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
          <div
            style={{
              width: "380px",
              height: "380px",
              opacity: 0.12, // 👈 0.035 වෙනුවට 0.10 - 0.15 අතර අගයක් දාලා බලන්න
              filter: "blur(0.5px)",
              transition: "all 0.9s ease",
            }}
          >
            <img
              src="/images/logo1.png"
              alt="Icon"
              style={{
                width: "380px",
                height: "380px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
        <span className="text-4xl">💌</span>
        <h1 className="mt-3 font-display text-2xl font-bold text-wine">
          Your invitation is ready
        </h1>
        <p className="mt-2 text-sm text-wine/70">
          Share this secret link — only someone with the link can open it.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-rosegold/50 bg-vanilla px-4 py-3">
          <span className="flex-1 truncate text-left text-sm text-ink">
            {inviteUrl || "Generating link..."}
          </span>
          <button
            onClick={copyLink}
            aria-label="Copy invitation link"
            className="shrink-0 text-wine hover:text-neon"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="mt-5">
          <WhatsappShareButton
            inviteUrl={inviteUrl}
            invitationerName={capitalize(invitationerName)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
          />
        </div>

        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-rosegold/50 px-6 py-3 text-sm font-medium text-wine hover:bg-blush"
          >
            <Mail size={16} /> Or send by email
          </button>
        ) : (
          <div className="mt-3 space-y-2 text-left">
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="their@email.com"
              className="w-full rounded-xl border border-rosegold/50 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
            />
            <button
              onClick={sendByEmail}
              disabled={!partnerEmail || emailStatus === "sending"}
              className="w-full rounded-full bg-wine px-4 py-2.5 text-sm font-semibold text-vanilla disabled:opacity-50"
            >
              {emailStatus === "sending" ? "Sending..." : "Send Email"}
            </button>
            {emailStatus === "sent" && (
              <p className="text-xs text-neon">Sent! 💌</p>
            )}
            {emailStatus === "error" && (
              <p className="text-xs text-red-600">
                Couldn't send — check the email and SMTP settings.
              </p>
            )}
          </div>
        )}

        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-wine underline decoration-rosegold underline-offset-4"
        >
          Go to my dashboard
        </Link>
      </div>
    </main>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
