"use client";

import { VIBE_OPTIONS } from "@/lib/datePresets";
import { InvitationDraft } from "@/lib/types";

interface Props {
  draft: InvitationDraft;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}

export default function Step6Summary({
  draft,
  submitting,
  error,
  onSubmit,
}: Props) {
  const vibeLabels = draft.offeredVibes
    .map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label)
    .filter(Boolean);
  const spotNames = draft.selectedDateSpots;

  return (
    <div className="space-y-6 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          Review & send
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          Double-check everything, then generate the secret link.
        </p>
      </div>

      <dl className="space-y-3 rounded-2xl border border-rosegold/40 bg-white/60 p-5 text-sm">
        <Row label="For" value={draft.invitationerName || "—"} />
        <Row label="Opening message" value={draft.introMessage || "—"} />
        <Row
          label="Vibes offered"
          value={vibeLabels.length ? vibeLabels.join(", ") : "—"}
        />
        <Row
          label="Date spots offered"
          value={spotNames.length ? spotNames.join(", ") : "—"}
        />
        <Row
          label="Secret message"
          value={
            draft.secretMessage
              ? `${draft.secretMessage.slice(0, 80)}${draft.secretMessage.length > 80 ? "…" : ""}`
              : "—"
          }
        />
        <Row
          label="Memory photos"
          value={`${draft.memoryPhotos.filter(Boolean).length} added`}
        />
      </dl>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || !draft.invitationerName}
        className="w-full rounded-full bg-wine px-6 py-4 text-center font-display text-lg font-semibold text-vanilla shadow-glow transition hover:bg-wine-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Creating your invitation..."
          : "Generate My Invitation Link 💌"}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-blush pb-2 last:border-0 last:pb-0 sm:flex-row sm:justify-between">
      <dt className="text-wine/60">{label}</dt>
      <dd className="font-medium text-ink sm:text-right">{value}</dd>
    </div>
  );
}
