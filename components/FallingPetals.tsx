"use client";

import { motion } from "framer-motion";

// A handful of soft blush-pink petals that drift down (top → bottom)
// with a gentle sway and rotation, looping forever. Purely decorative —
// floats across the FULL page (fixed, viewport-wide), not just the hero
// section's height, so petals never "cut off" at the section boundary.

interface PetalSpec {
  left: string;
  size: number;
  duration: number;
  delay: number;
  swayDistance: number;
  rotateStart: number;
}

const petals: PetalSpec[] = [
  {
    left: "4%",
    size: 34,
    duration: 16,
    delay: 0,
    swayDistance: 30,
    rotateStart: 10,
  },
  {
    left: "13%",
    size: 20,
    duration: 12.5,
    delay: 3.2,
    swayDistance: 22,
    rotateStart: -20,
  },
  {
    left: "24%",
    size: 26,
    duration: 18,
    delay: 7.5,
    swayDistance: 34,
    rotateStart: 25,
  },
  {
    left: "33%",
    size: 21,
    duration: 14,
    delay: 1.8,
    swayDistance: 24,
    rotateStart: -12,
  },
  {
    left: "44%",
    size: 23,
    duration: 15.5,
    delay: 9.1,
    swayDistance: 26,
    rotateStart: 16,
  },
  {
    left: "55%",
    size: 25,
    duration: 17,
    delay: 5.4,
    swayDistance: 28,
    rotateStart: 18,
  },
  {
    left: "63%",
    size: 19,
    duration: 11,
    delay: 2.6,
    swayDistance: 20,
    rotateStart: -24,
  },
  {
    left: "72%",
    size: 12,
    duration: 13.5,
    delay: 6.3,
    swayDistance: 25,
    rotateStart: 14,
  },
  {
    left: "81%",
    size: 16,
    duration: 19,
    delay: 0.9,
    swayDistance: 32,
    rotateStart: -18,
  },
  {
    left: "90%",
    size: 11,
    duration: 12,
    delay: 8.4,
    swayDistance: 23,
    rotateStart: 22,
  },
  {
    left: "96%",
    size: 10,
    duration: 10.5,
    delay: 4.7,
    swayDistance: 21,
    rotateStart: -16,
  },
];

function PetalShape({ size, id }: { size: number; id: string }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0C15 5 20 12 10 26C0 12 5 5 10 0Z" fill={`url(#${id})`} />
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="20"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8D9DF" />
          <stop offset="1" stopColor="#E59AAA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FallingPetals() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: p.left }}
          initial={{ y: "-10vh", opacity: 0, rotate: p.rotateStart }}
          animate={{
            y: "110vh",
            x: [0, p.swayDistance, -p.swayDistance * 0.7, 0],
            rotate: [p.rotateStart, p.rotateStart + 180, p.rotateStart + 360],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalShape size={p.size} id={`petal-gradient-${i}`} />
        </motion.div>
      ))}
    </div>
  );
}
