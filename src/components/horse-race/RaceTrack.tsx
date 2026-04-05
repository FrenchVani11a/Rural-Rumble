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
      <div className="flex items-center justify-center h-64 bg-gradient-to-b from-green-800 to-green-900 rounded-2xl border-2 border-green-700">
        <p className="text-white/60 text-lg">
          Add players to start the race!
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-green-700">
      {/* Animated fairway background */}
      <div
        className="absolute inset-0 animate-fairway"
        style={{
          background:
            "repeating-linear-gradient(90deg, #1a5e1a 0px, #1e6b1e 20px, #1a5e1a 40px, #176017 60px, #1a5e1a 80px)",
        }}
      />

      {/* Top shadow for depth */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/20 to-transparent z-[6]" />
      {/* Bottom shadow for depth */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent z-[6]" />

      {/* Finish line */}
      <FinishLine />

      {/* Start line */}
      <div className="absolute left-10 top-0 bottom-0 w-1 z-[6]">
        <div className="h-full w-full bg-white/20" style={{
          background: "repeating-linear-gradient(180deg, white 0px, white 4px, transparent 4px, transparent 8px)"
        }} />
      </div>

      {/* Distance markers */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/30 z-[6] flex items-center">
        {[
          { pct: 25, label: "25%" },
          { pct: 50, label: "HALFWAY" },
          { pct: 75, label: "75%" },
        ].map(({ pct, label }) => (
          <div
            key={pct}
            className="absolute flex flex-col items-center"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-px h-3 bg-white/30" />
            <span className="text-white/30 text-[8px] font-medium tracking-wider uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* 18th hole flag near finish */}
      <div className="absolute right-8 top-2 z-[11] flex items-center gap-1">
        <div className="text-[10px] text-white/40 font-bold">18</div>
        <div className="text-sm">🚩</div>
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
              <RaceLane
                entry={entry}
                isLeader={entry.rank === 1 && entry.score !== null}
              />
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
