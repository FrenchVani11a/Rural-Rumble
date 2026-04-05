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
      className={`relative h-[72px] md:h-[88px] ${
        isLeader ? "leader-glow" : ""
      }`}
    >
      {/* Lane separator — grass mowing pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      <div className="absolute bottom-1 left-0 right-0 h-px bg-black/15" />

      {/* Leader highlight */}
      {isLeader && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-yellow-400/10 to-yellow-400/5" />
      )}

      {/* Rank badge */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
            rank === 1
              ? "bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900 ring-2 ring-yellow-400/50"
              : rank === 2
              ? "bg-gradient-to-b from-gray-200 to-gray-400 text-gray-800"
              : rank === 3
              ? "bg-gradient-to-b from-amber-500 to-amber-700 text-white"
              : "bg-white/15 text-white/60 backdrop-blur-sm"
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
        <DustTrail intensity={dustIntensity} />

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
            size={36}
          />
        </motion.div>
      </motion.div>

      {/* Player info (right side) */}
      <div className="absolute right-9 top-1/2 -translate-y-1/2 text-right z-20">
        <div className="text-white font-bold text-xs md:text-sm truncate max-w-[100px] md:max-w-[140px]">
          {player.name}
        </div>
        {score ? (
          <div className="text-white/60 text-[10px] md:text-xs flex items-center justify-end gap-1">
            <span className="font-semibold text-white/80">Net {score.net_score}</span>
            <span
              className={`font-bold px-1 py-0.5 rounded text-[9px] ${
                toPar! < 0
                  ? "bg-green-500/20 text-green-400"
                  : toPar === 0
                  ? "bg-white/10 text-white/60"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {toPar! > 0 ? "+" : ""}
              {toPar === 0 ? "E" : toPar}
            </span>
            <span className="text-white/30 hidden md:inline">
              Thru {score.holes_played ?? 18}
            </span>
          </div>
        ) : (
          <div className="text-white/30 text-[10px]">No score yet</div>
        )}
      </div>
    </div>
  );
}
