"use client";

import { motion } from "motion/react";
import { HoleInfo } from "@/lib/constants";
import {
  PlayerHoleResult,
  HoleCommentary,
  HoleFeature,
  HOLE_FEATURES,
  getScoreColor,
  getScoreReactionEmoji,
} from "@/lib/course-commentary";

interface HoleCardProps {
  hole: HoleInfo;
  playerScores: PlayerHoleResult[];
  commentary: HoleCommentary;
  index: number;
}

function getParLabel(par: number): string {
  if (par === 3) return "Par 3";
  if (par === 4) return "Par 4";
  return "Par 5";
}

function getSIDifficulty(si: number): string {
  if (si === 1) return "Hardest";
  if (si <= 3) return "Brutal";
  if (si <= 6) return "Tough";
  if (si <= 12) return "Medium";
  if (si <= 15) return "Friendly";
  return "Easiest";
}

function getToParDisplay(toPar: number): string {
  if (toPar === 0) return "E";
  if (toPar > 0) return `+${toPar}`;
  return `${toPar}`;
}

export function HoleCard({ hole, playerScores, commentary, index }: HoleCardProps) {
  const feature: HoleFeature = HOLE_FEATURES[hole.hole];
  const isHardest = hole.strokeIndex === 1;
  const isLongest = hole.hole === 11;
  const isFinisher = hole.hole === 18;
  const isScenic = feature.tags.includes("scenic");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className={`rounded-2xl border overflow-hidden ${
        isHardest
          ? "bg-red-950/40 border-red-500/30"
          : isScenic
          ? "bg-emerald-950/40 border-emerald-500/20"
          : "bg-white/5 border-white/10"
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                isHardest
                  ? "bg-red-500/20 text-red-300"
                  : hole.par === 3
                  ? "bg-sky-500/20 text-sky-300"
                  : hole.par === 5
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-yellow-400/20 text-yellow-300"
              }`}
            >
              {hole.hole}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{getParLabel(hole.par)}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50 text-sm">{hole.yards}m</span>
                <span className="text-white/30">·</span>
                <span className="text-white/40 text-xs">SI {hole.strokeIndex}</span>
              </div>
              <div className="text-white/30 text-xs">{getSIDifficulty(hole.strokeIndex)}</div>
            </div>
          </div>
          <div className="flex gap-1">
            {isHardest && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                Hardest
              </span>
            )}
            {isLongest && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                Longest
              </span>
            )}
            {isFinisher && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold uppercase tracking-wider">
                18th
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Terrain strip */}
      <div className="mx-4 mb-3">
        <div
          className={`rounded-lg px-3 py-2 text-center text-sm tracking-wider ${
            isHardest
              ? "bg-gradient-to-r from-red-900/40 via-red-800/20 to-red-900/40"
              : "bg-gradient-to-r from-green-900/40 via-green-800/20 to-green-900/40"
          }`}
        >
          <div className="text-base leading-relaxed" aria-hidden="true">
            {feature.terrain}
          </div>
          <div className="text-white/30 text-[11px] mt-0.5 italic">
            {feature.description}
          </div>
        </div>
      </div>

      {/* Player scores */}
      <div className="px-4 pb-2">
        {playerScores.length === 0 ? (
          <div className="text-white/20 text-xs italic text-center py-3">
            No scores yet — the fairway awaits...
          </div>
        ) : (
          <div className="space-y-1.5">
            {playerScores.map((result) => (
              <div
                key={result.player.id}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border ${getScoreColor(result.toPar)}`}
              >
                {/* Avatar */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: result.player.avatar_color }}
                >
                  {result.player.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                {/* Name */}
                <span className="text-xs font-medium truncate flex-1 min-w-0">
                  {result.player.name.split(" ")[0]}
                </span>

                {/* Gross score */}
                <span className="text-sm font-bold tabular-nums w-5 text-center">
                  {result.gross}
                </span>

                {/* To par badge */}
                <span className="text-[10px] font-mono w-6 text-center opacity-70">
                  {getToParDisplay(result.toPar)}
                </span>

                {/* Emoji */}
                <span className="text-sm">
                  {getScoreReactionEmoji(result.toPar)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commentary footer */}
      <div
        className={`px-4 py-3 border-t ${
          isHardest ? "border-red-500/10 bg-red-950/20" : "border-white/5 bg-white/[0.02]"
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="text-lg leading-none mt-0.5">{commentary.emoji}</span>
          <div className="min-w-0">
            <div
              className="text-white/80 font-bold text-sm leading-tight"
              style={{ fontFamily: "var(--font-bungee)" }}
            >
              {commentary.nickname}
            </div>
            <div className="text-white/30 text-xs">{commentary.subtitle}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
