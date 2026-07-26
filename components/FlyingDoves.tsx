"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Two realistic white doves that fly across the FULL page (fixed,
// viewport-wide) in long sweeping diagonal arcs, looping forever.
// Purely decorative — sits behind the hero text content.
//
// ── HOW TO SET THE IMAGE ──────────────────────────────────────────
// Drop a transparent-background dove/pigeon PNG into your /public folder
// (e.g. /public/dove.png) and set DOVE_IMAGE_SRC below to that path.
// A transparent PNG (wings spread, side/3-quarter angle, like the
// reference photo) reads as the most "real" — avoid images with a
// visible white/solid background since it will show as a box.
// ────────────────────────────────────────────────────────────────

const DOVE_IMAGE_SRC = "/images/dov.png"; // 👈 change this to your actual file path

interface DoveSpec {
  id: string;
  // start/end as viewport-relative offsets so the path always covers
  // the full screen regardless of device size
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  // a mid-flight waypoint so the path isn't a perfectly straight line
  midX: string;
  midY: string;
  size: number;
  duration: number;
  delay: number;
  flip: boolean; // mirror the image so it faces its direction of travel
  flapSpeed: number; // subtle wing-flap pulse speed (seconds)
}

const doves: DoveSpec[] = [
  {
    id: "dove-1",
    startX: "-15vw",
    startY: "70vh",
    midX: "45vw",
    midY: "20vh",
    endX: "115vw",
    endY: "55vh",
    size: 90,
    duration: 26,
    delay: 0,
    flip: false,
    flapSpeed: 0.9,
  },
  {
    id: "dove-2",
    startX: "115vw",
    startY: "30vh",
    midX: "55vw",
    midY: "75vh",
    endX: "-15vw",
    endY: "45vh",
    size: 70,
    duration: 32,
    delay: 6,
    flip: true,
    flapSpeed: 1.1,
  },
];

function Dove({ d }: { d: DoveSpec }) {
  // Travel direction determines the base facing of the image.
  // flip=true means the source photo faces left, so we mirror it
  // (scaleX: -1) to face right, or vice versa depending on travel path.
  const baseFlip = d.flip ? -1 : 1;

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ left: 0, top: 0, width: d.size, height: d.size }}
      initial={{
        x: d.startX,
        y: d.startY,
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        x: [d.startX, d.midX, d.endX],
        y: [d.startY, d.midY, d.endY],
        opacity: [0, 1, 1, 0],
        // gentle bank/tilt as the dove "steers" through the waypoint
        rotate: d.flip ? [4, -6, 3] : [-4, 6, -3],
      }}
      transition={{
        duration: d.duration,
        delay: d.delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      }}
    >
      {/* Wing-flap illusion: subtle vertical squash/stretch pulse,
          independent of the flight-path animation above */}
      <motion.div
        animate={{ scaleY: [1, 0.92, 1.04, 1], scaleX: [1, 1.03, 0.97, 1] }}
        transition={{
          duration: d.flapSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "100%",
          height: "100%",
          transform: `scaleX(${baseFlip})`,
        }}
      >
        <Image
          src={DOVE_IMAGE_SRC}
          alt=""
          width={d.size}
          height={d.size}
          className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
          priority={false}
        />
      </motion.div>
    </motion.div>
  );
}

export default function FlyingDoves() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {doves.map((d) => (
        <Dove key={d.id} d={d} />
      ))}
    </div>
  );
}
