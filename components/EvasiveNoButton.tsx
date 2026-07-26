"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  label?: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * A "No" button that gracefully dodges the cursor / finger whenever it gets
 * close, so the only real option left is "Yes". Works with both mouse
 * (pointermove proximity) and touch (pointerdown/touchstart triggers a dodge
 * immediately, since touch has no "hover" to detect proximity).
 */
export default function EvasiveNoButton({
  label = "No 😅",
  containerRef,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  const dodge = (clientX?: number, clientY?: number) => {
    const container = containerRef.current;
    const btn = btnRef.current;
    if (!container || !btn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    const maxX = Math.max(cRect.width - bRect.width - 16, 16);
    const maxY = Math.max(cRect.height - bRect.height - 16, 16);

    let nextX = Math.random() * maxX;
    let nextY = Math.random() * maxY;

    // If we know the pointer position, bias the new spot away from it
    if (clientX !== undefined && clientY !== undefined) {
      const pointerX = clientX - cRect.left;
      const pointerY = clientY - cRect.top;
      for (let attempt = 0; attempt < 6; attempt++) {
        const candX = Math.random() * maxX;
        const candY = Math.random() * maxY;
        const dist = Math.hypot(candX - pointerX, candY - pointerY);
        if (dist > Math.min(cRect.width, cRect.height) * 0.35) {
          nextX = candX;
          nextY = candY;
          break;
        }
      }
    }

    setPos({ x: nextX, y: nextY });
    setDodgeCount((c) => c + 1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const bRect = btn.getBoundingClientRect();
    const btnCenterX = bRect.left + bRect.width / 2;
    const btnCenterY = bRect.top + bRect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    const proximityThreshold = e.pointerType === "touch" ? 90 : 70;
    if (dist < proximityThreshold) {
      dodge(e.clientX, e.clientY);
    }
  };

  const funnyLabels = [
    "No 😅",
    "Nice try 😏",
    "Nope!",
    "Almost 😂",
    "Not today 💅",
    "Try again 😌",
    "So close!",
    "Catch me first 🏃‍♀️",
  ];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative h-56 w-full sm:h-64"
    >
      <motion.button
        ref={btnRef}
        type="button"
        onPointerEnter={(e) => dodge(e.clientX, e.clientY)}
        onClick={(e) => dodge(e.clientX, e.clientY)}
        aria-label="No (this button playfully dodges — the invitation only accepts Yes)"
        animate={{ left: pos.x, top: pos.y }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="absolute font-scriptnew rounded-full border-2 border-wine/30 bg-white/80 px-5 py-3 text-sm font-semibold text-wine shadow-md backdrop-blur-sm"
        style={{ left: pos.x, top: pos.y }}
      >
        {funnyLabels[Math.min(dodgeCount, funnyLabels.length - 1)]}
      </motion.button>
    </div>
  );
}
