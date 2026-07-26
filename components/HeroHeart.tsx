"use client";

import { useState } from "react";

const HEART_PATH =
  "M0.5,0.94 C0.5,0.94 0.06,0.63 0.06,0.34 C0.06,0.16 0.21,0.04 0.38,0.04 C0.45,0.04 0.5,0.09 0.5,0.09 C0.5,0.09 0.55,0.04 0.62,0.04 C0.79,0.04 0.94,0.16 0.94,0.34 C0.94,0.63 0.5,0.94 0.5,0.94 Z";

export default function HeroHeart({
  photoSrc = "/images/hero-couple2.png",
}: {
  photoSrc?: string;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="relative mx-auto aspect-square w-64 shrink-0 sm:w-80 md:w-96">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="heroHeartClip" clipPathUnits="objectBoundingBox">
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative h-full w-full animate-float"
        style={{ clipPath: "url(#heroHeartClip)" }}
      >
        {imgOk ? (
          <img
            src={photoSrc}
            alt="A couple, illustrating HithaLink's date invitations"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover [filter:sepia(20%)_saturate(140%)_hue-rotate(-8deg)_brightness(0.97)]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rosegold to-wine">
            <span className="text-6xl">💑</span>
          </div>
        )}
        {/* soft red filter so the photo stays gentle, not the focal point */}
        <div className="absolute inset-0 bg-gradient-to-br from-wine/50 via-neon/25 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-neon/10" />
      </div>
    </div>
  );
}
