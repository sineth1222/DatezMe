"use client";

import { useState } from "react";
import { DISTRICTS } from "@/lib/datePresets";
import { InvitationDraft } from "@/lib/types";

interface Props {
  draft: InvitationDraft;
  update: (patch: Partial<InvitationDraft>) => void;
}

export default function Step3DateSpots({ draft, update }: Props) {
  const initialDistrict =
    DISTRICTS.find((d) =>
      d.spots.some((s) => draft.selectedDateSpots.includes(s.name)),
    )?.id || DISTRICTS[0].id;
  const [activeDistrict, setActiveDistrict] = useState(initialDistrict);

  const district = DISTRICTS.find((d) => d.id === activeDistrict)!;

  const toggle = (name: string) => {
    const set = new Set(draft.selectedDateSpots);
    set.has(name) ? set.delete(name) : set.add(name);
    update({ selectedDateSpots: Array.from(set) });
  };

  return (
    <div className="space-y-5 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          Pick date spots to offer
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          Choose a district, then pick a few spots —{" "}
          {draft.invitationerName || "they"} will choose their favorite when
          responding.
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {DISTRICTS.map((d) => {
          const active = d.id === activeDistrict;
          const countInDistrict = d.spots.filter((s) =>
            draft.selectedDateSpots.includes(s.name),
          ).length;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDistrict(d.id)}
              className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-neon bg-blush text-wine"
                  : "border-rosegold/40 bg-white/60 text-ink/70"
              }`}
            >
              {d.emoji} {d.name}
              {countInDistrict > 0 && (
                <span className="ml-1.5 rounded-full bg-neon px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {countInDistrict}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-wine/50">{district.province} Province</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {district.spots.map((spot) => {
          const active = draft.selectedDateSpots.includes(spot.name);
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => toggle(spot.name)}
              aria-pressed={active}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-neon bg-blush shadow-glow"
                  : "border-rosegold/40 bg-white/60 hover:border-rosegold"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{spot.emoji}</span>
                <span className="font-display font-semibold text-wine">
                  {spot.name}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/70">{spot.blurb}</p>
              <ul className="mt-2 space-y-0.5">
                {spot.activities.slice(0, 2).map((a) => (
                  <li key={a} className="text-xs text-wine/60">
                    · {a}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {draft.selectedDateSpots.length === 0 && (
        <p className="text-xs text-wine/50">
          Tip: pick 2-3 spots (even across different districts) so they have
          real options to choose between.
        </p>
      )}
      {draft.selectedDateSpots.length > 0 && (
        <p className="text-xs font-medium text-wine">
          {draft.selectedDateSpots.length} spot(s) selected across all districts
        </p>
      )}
    </div>
  );
}
