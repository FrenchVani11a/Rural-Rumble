"use client";

import { useMemo } from "react";
import { Player, Score, LeaderboardEntry } from "@/lib/types";
import { buildLeaderboard, calculateFromHoleScores } from "@/lib/scoring";
import { HOLES } from "@/lib/constants";
import { RaceTrack } from "@/components/horse-race/RaceTrack";

interface HoleSelectorProps {
  players: Player[];
  scores: Score[];
  selectedHole: number; // 0 = live (all holes), 1-18 = specific hole
  onHoleChange: (hole: number) => void;
}

export function HoleSelector({
  players,
  scores,
  selectedHole,
  onHoleChange,
}: HoleSelectorProps) {
  // Pre-compute snapshot for the selected hole
  const entries = useMemo(() => {
    if (selectedHole === 0) return null; // use live data

    const partialScores: Score[] = [];
    for (const score of scores) {
      const player = players.find((p) => p.id === score.player_id);
      if (!player) continue;

      const partialHoles = score.hole_scores.filter(
        (hs) => hs.hole <= selectedHole
      );
      if (partialHoles.length === 0) continue;

      const calc = calculateFromHoleScores(partialHoles, player.handicap);
      partialScores.push({
        ...score,
        gross_score: calc.grossTotal,
        net_score: calc.netTotal,
        holes_played: calc.holesPlayed,
        par_played: calc.parPlayed,
        hole_scores: partialHoles,
      });
    }

    return buildLeaderboard(players, partialScores);
  }, [players, scores, selectedHole]);

  return (
    <div>
      {/* Hole slider */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs uppercase tracking-wider">
            View standings at hole
          </span>
          <span className="text-yellow-400 font-bold text-sm">
            {selectedHole === 0 ? "LIVE" : `Hole ${selectedHole}`}
            {selectedHole > 0 && (
              <span className="text-white/30 font-normal ml-1">
                (Par {HOLES[selectedHole - 1].par})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onHoleChange(0)}
            className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-colors ${
              selectedHole === 0
                ? "bg-yellow-400 text-green-900"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
          >
            LIVE
          </button>
          <input
            type="range"
            min="1"
            max="18"
            value={selectedHole || 1}
            onChange={(e) => onHoleChange(parseInt(e.target.value))}
            className="flex-1 h-2 accent-yellow-400 cursor-pointer"
          />
        </div>

        {/* Hole number labels */}
        <div className="flex justify-between mt-1 px-8">
          {[1, 5, 9, 14, 18].map((h) => (
            <button
              key={h}
              onClick={() => onHoleChange(h)}
              className={`text-[9px] transition-colors ${
                selectedHole === h
                  ? "text-yellow-400 font-bold"
                  : "text-white/25 hover:text-white/50"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Show the filtered race track if a hole is selected */}
      {entries && <RaceTrack entries={entries} />}
    </div>
  );
}
