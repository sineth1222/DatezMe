"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";

function LoginContent() {
  const supabase = createClient();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (typeof window !== "undefined" ? window.location.origin : "") +
    `/auth/callback?next=${encodeURIComponent(next)}`;

  const signInWithGoogle = async () => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, data: { name } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="relative font-display flex min-h-screen items-center justify-center overflow-hidden bg-vanilla bg-wine-glow bg-noise px-4">
      <FloatingHearts />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-rosegold/30 bg-white/70 p-8 text-center shadow-xl backdrop-blur-md">
        <div className="text-4xl flex justify-center items-center">
          <img
            src="/images/logo1.png"
            alt="Icon"
            style={{
              width: "50px",
              height: "50px",
              //objectFit: "contain",
            }}
            className="justify-center items-center"
          />
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold text-wine">
          Welcome to DatezMe.
        </h1>
        <p className="mt-2 font-display text-sm text-wine/70">
          One click. No lengthy forms. Just your name and email.
        </p>
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

        <button
          onClick={signInWithGoogle}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rosegold/50 bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-blush"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-wine/40">
          <span className="h-px flex-1 bg-rosegold/30" />
          or
          <span className="h-px flex-1 bg-rosegold/30" />
        </div>

        {sent ? (
          <p className="rounded-xl bg-blush px-4 py-3 text-sm text-wine">
            Magic link sent 💌 check {email} to continue.
          </p>
        ) : (
          <form onSubmit={sendMagicLink} className="space-y-3 text-left">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-2xl border border-rosegold/50 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              required
              className="w-full rounded-2xl border border-rosegold/50 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-wine px-5 py-3 text-sm font-semibold text-vanilla shadow-glow disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
