"use client";

import { LayoutGroup, motion } from "motion/react";
import { RaceLane } from "./RaceLane";
import { FinishLine } from "./FinishLine";
import { LeaderboardEntry } from "@/lib/types";

interface RaceTrackProps {
  entries: LeaderboardEntry[];
}

export function RaceTrack({ entries }: RaceTrackProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-b from-green-800 to-green-900 rounded-2xl">
        <p className="text-white/60 text-lg">
          Add players to start the race!
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-green-700">
      {/* Fairway background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, #1a5e1a 0px, #1a5e1a 40px, #1d6b1d 40px, #1d6b1d 80px)",
        }}
      />

      {/* Finish line */}
      <FinishLine />

      {/* Start line */}
      <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-white/30 z-10" />

      {/* Distance markers */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-black/20 z-10 flex items-center px-10">
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute text-white/30 text-[10px]"
            style={{ left: `${pct}%` }}
          >
            |
          </div>
        ))}
      </div>

      {/* Lanes */}
      <LayoutGroup>
        <div className="relative z-5">
          {entries.map((entry) => (
            <motion.div
              key={entry.player.id}
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <RaceLane entry={entry} isLeader={entry.rank === 1 && entry.score !== null} />
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
