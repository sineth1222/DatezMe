"use client";

import { useRef } from "react";
import EvasiveNoButton from "@/components/EvasiveNoButton";
import { InvitationDraft } from "@/lib/types";

export default function Step2Question({ draft }: { draft: InvitationDraft }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          The playful question
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          This is exactly what {draft.invitationerName || "they"} will see. Try
          chasing the "No" button — you won't catch it.
        </p>
      </div>

      <div className="rounded-3xl border border-rosegold/40 bg-white/60 p-6 text-center">
        <p className="font-display text-xl text-wine">
          Will you go on a date with me?
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            className="rounded-full font-scriptnew bg-neon px-8 py-4 text-lg font-bold text-white shadow-glow transition hover:scale-105"
          >
            YES 💖
          </button>
        </div>
        <EvasiveNoButton containerRef={containerRef} />
      </div>

      <p className="text-center text-xs text-wine/50">
        This step is a live preview only — nothing to fill in here.
      </p>
    </div>
  );
}
