"use client";

import { motion } from "motion/react";

export function Trophy({ size = 120 }: { size?: number }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, -2, 2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow */}
        <circle cx="60" cy="50" r="45" fill="#FFD700" opacity="0.15" />
        {/* Cup body */}
        <path
          d="M35 20 L35 55 C35 72 45 80 60 80 C75 80 85 72 85 55 L85 20 Z"
          fill="url(#gold-gradient)"
          stroke="#B8860B"
          strokeWidth="2"
        />
        {/* Left handle */}
        <path
          d="M35 28 C20 28 15 40 15 48 C15 56 20 65 35 65"
          stroke="#B8860B"
          strokeWidth="4"
          fill="none"
        />
        {/* Right handle */}
        <path
          d="M85 28 C100 28 105 40 105 48 C105 56 100 65 85 65"
          stroke="#B8860B"
          strokeWidth="4"
          fill="none"
        />
        {/* Star */}
        <polygon
          points="60,32 64,44 77,44 67,52 70,64 60,56 50,64 53,52 43,44 56,44"
          fill="#B8860B"
        />
        {/* Stem */}
        <rect x="55" y="80" width="10" height="15" fill="#B8860B" />
        {/* Base */}
        <ellipse cx="60" cy="100" rx="22" ry="6" fill="#B8860B" />
        <ellipse cx="60" cy="98" rx="22" ry="6" fill="url(#gold-gradient)" />
        <defs>
          <linearGradient id="gold-gradient" x1="35" y1="20" x2="85" y2="80">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
