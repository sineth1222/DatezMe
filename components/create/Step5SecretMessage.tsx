"use client";

import UploadField from "@/components/UploadField";
import { InvitationDraft } from "@/lib/types";

interface Props {
  draft: InvitationDraft;
  update: (patch: Partial<InvitationDraft>) => void;
}

export default function Step5SecretMessage({ draft, update }: Props) {
  const photos = draft.memoryPhotos;

  const setPhoto = (index: number, url: string) => {
    const next = [...photos];
    if (url) next[index] = url;
    else next.splice(index, 1);
    update({ memoryPhotos: next });
  };

  return (
    <div className="space-y-6 font-display">
      <div>
        <h2 className="font-display text-2xl font-semibold text-wine">
          A secret message
        </h2>
        <p className="mt-1 text-sm text-wine/70">
          Write something from the heart, and add 1-3 memory photos if you like.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-wine">
          Your letter
        </span>
        <textarea
          value={draft.secretMessage}
          onChange={(e) => update({ secretMessage: e.target.value })}
          rows={5}
          placeholder="From the day I met you..."
          className="w-full resize-none rounded-2xl border border-rosegold/50 bg-white/70 px-4 py-3 font-script text-lg leading-relaxed text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
        />
      </label>

      <div className="space-y-3">
        <span className="block text-sm font-medium text-wine">
          Memory photos (up to 3)
        </span>
        {photos.map((url, i) => (
          <UploadField
            key={i}
            label={`Photo ${i + 1}`}
            accept="image"
            value={url}
            folder="/hithalink/memories"
            onChange={(u) => setPhoto(i, u)}
          />
        ))}
        {photos.length < 3 && (
          <UploadField
            label={`Photo ${photos.length + 1}`}
            accept="image"
            value=""
            folder="/hithalink/memories"
            onChange={(u) => u && update({ memoryPhotos: [...photos, u] })}
          />
        )}
      </div>
    </div>
  );
}
