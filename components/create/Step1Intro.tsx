"use client";

import UploadField from "@/components/UploadField";
import { InvitationDraft } from "@/lib/types";

interface Props {
  draft: InvitationDraft;
  update: (patch: Partial<InvitationDraft>) => void;
}

export default function Step1Intro({ draft, update }: Props) {
  return (
    <div className="space-y-6 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          Who is this for?
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          Their name appears right on the opening page — "Hi [name] ❤️".
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-wine">
          Their name
        </span>
        <input
          value={draft.invitationerName}
          onChange={(e) => update({ invitationerName: e.target.value })}
          placeholder="e.g. Amaya"
          className="w-full rounded-2xl border border-rosegold/50 bg-white/70 px-4 py-3 text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
        />
      </label>

      <UploadField
        label="Cover photo (optional)"
        accept="image"
        value={draft.coverPhotoUrl}
        folder="/hithalink/covers"
        onChange={(url) => update({ coverPhotoUrl: url })}
      />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-wine">
          Opening message
        </span>
        <textarea
          value={draft.introMessage}
          onChange={(e) => update({ introMessage: e.target.value })}
          rows={3}
          placeholder="I've been wanting to ask you something..."
          className="w-full resize-none rounded-2xl border border-rosegold/50 bg-white/70 px-4 py-3 text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
        />
      </label>

      <UploadField
        label="Background music (optional)"
        accept="audio"
        value={draft.musicUrl}
        folder="/hithalink/music"
        onChange={(url) => update({ musicUrl: url })}
        helperText="A soft lofi or acoustic track, up to 15MB."
      />
    </div>
  );
}
