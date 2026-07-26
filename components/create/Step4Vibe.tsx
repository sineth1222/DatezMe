"use client";

import { VIBE_OPTIONS } from "@/lib/datePresets";
import { InvitationDraft } from "@/lib/types";

interface Props {
  draft: InvitationDraft;
  update: (patch: Partial<InvitationDraft>) => void;
}

export default function Step4Vibe({ draft, update }: Props) {
  const toggle = (id: string) => {
    const set = new Set(draft.offeredVibes);
    set.has(id) ? set.delete(id) : set.add(id);
    update({ offeredVibes: Array.from(set) });
  };

  return (
    <div className="space-y-6 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          Vibes to offer
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          Pick a few moods — they'll choose their favorite when they respond.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {VIBE_OPTIONS.map((v) => {
          const active = draft.offeredVibes.includes(v.id);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => toggle(v.id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition ${
                active
                  ? "border-neon bg-blush shadow-glow"
                  : "border-rosegold/40 bg-white/60 hover:border-rosegold"
              }`}
            >
              <span className="text-3xl">{v.emoji}</span>
              <span className="font-display text-sm font-semibold text-wine">
                {v.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
