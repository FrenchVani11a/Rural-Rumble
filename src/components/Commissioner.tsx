"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function Commissioner() {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="relative">
        {/* Glow behind */}
        <div className="absolute inset-0 blur-3xl bg-yellow-400/15 rounded-full scale-125" />

        {/* Animated floating photo */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -1.5, 1.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Photo with fun styling */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-2xl shadow-yellow-400/20">
            <Image
              src="/commissioner.jpg"
              alt="The Commissioner"
              fill
              className="object-cover object-top"
              sizes="192px"
            />
          </div>

          {/* Golf club emoji overlay */}
          <motion.div
            className="absolute -right-3 -bottom-1 text-4xl"
            animate={{ rotate: [0, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🏌️
          </motion.div>

          {/* Crown on top */}
          <motion.div
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            👑
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <div
          className="text-yellow-400 text-sm md:text-base font-bold tracking-wider uppercase"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          The Commissioner
        </div>
        <div className="text-white/40 text-xs mt-0.5">
          Tournament Organiser & Chief Sledger
        </div>
      </div>
    </motion.div>
  );
}
