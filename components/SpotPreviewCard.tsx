"use client";

import { useState } from "react";

interface Props {
  imageSrc: string;
  emoji: string;
  name: string;
  districtName: string;
}

export default function SpotPreviewCard({
  imageSrc,
  emoji,
  name,
  districtName,
}: Props) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-rosegold/30 shadow-md">
      {imgOk ? (
        <img
          src={imageSrc}
          alt={name}
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rosegold to-wine" />
      )}

      {/* dark overlay so the text stays readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 text-left">
        <span className="text-2xl">{emoji}</span>
        <p className="mt-1 font-display font-semibold text-white drop-shadow-sm">
          {name}
        </p>
        <p className="text-xs text-white/75">{districtName} District</p>
      </div>
    </div>
  );
}
