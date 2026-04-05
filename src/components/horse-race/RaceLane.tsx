"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { GolfCart } from "./GolfCart";
import { DustTrail } from "./DustTrail";
import { LeaderboardEntry } from "@/lib/types";
import { COURSE } from "@/lib/constants";

interface RaceLaneProps {
  entry: LeaderboardEntry;
  isLeader: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RaceLane({ entry, isLeader }: RaceLaneProps) {
  const { player, score, rank, racePosition } = entry;

  // Dust trail: track previous position
  const prevPosition = useRef(racePosition);
  const [dustIntensity, setDustIntensity] = useState(0);

  useEffect(() => {
    const delta = Math.abs(racePosition - prevPosition.current);
    setDustIntensity(Math.min(delta / 20, 1));
    prevPosition.current = racePosition;
  }, [racePosition]);

  // Spin-out: track previous rank
  const prevRank = useRef(rank);
  const [isSpinningOut, setIsSpinningOut] = useState(false);
  const spinTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (score && rank > prevRank.current) {
      setIsSpinningOut(true);
      spinTimeout.current = setTimeout(() => setIsSpinningOut(false), 800);
    }
    prevRank.current = rank;
    return () => {
      if (spinTimeout.current) clearTimeout(spinTimeout.current);
    };
  }, [rank, score]);

  const toPar = score
    ? score.net_score - (score.par_played || COURSE.par)
    : null;

  return (
    <div
      className={`relative h-20 md:h-24 border-b-2 border-dashed border-white/20 ${
        isLeader ? "bg-yellow-400/10" : ""
      }`}
    >
      {/* Rank badge */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            rank === 1
              ? "bg-yellow-400 text-yellow-900"
              : rank === 2
              ? "bg-gray-300 text-gray-800"
              : rank === 3
              ? "bg-amber-600 text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {rank}
        </div>
      </div>

      {/* Animated golf cart */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 z-10"
        animate={{ left: `${racePosition}%` }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 1.5,
        }}
      >
        {/* Dust trail */}
        <DustTrail intensity={dustIntensity} />

        {/* Cart with optional spin-out */}
        <motion.div
          animate={
            isSpinningOut
              ? { rotate: [0, -15, 22, -8, 4, 0], y: [0, -4, 2, -1, 0] }
              : { rotate: 0, y: 0 }
          }
          transition={
            isSpinningOut
              ? { duration: 0.7, ease: "easeOut" }
              : { duration: 0.3 }
          }
        >
          <GolfCart
            color={player.avatar_color}
            initials={getInitials(player.name)}
            size={40}
          />
        </motion.div>
      </motion.div>

      {/* Player info (right side) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right z-20">
        <div className="text-white font-bold text-sm md:text-base truncate max-w-[120px]">
          {player.name}
        </div>
        {score ? (
          <div className="text-white/70 text-xs md:text-sm">
            Net {score.net_score}
            <span className="ml-1 text-white/50">
              {toPar! > 0 ? "+" : ""}
              {toPar === 0 ? "E" : toPar}
            </span>
            <span className="ml-1 text-white/30">
              (Thru {score.holes_played ?? 18})
            </span>
          </div>
        ) : (
          <div className="text-white/40 text-xs">No score yet</div>
        )}
      </div>
    </div>
  );
}
