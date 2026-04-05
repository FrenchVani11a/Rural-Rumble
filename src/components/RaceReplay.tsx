"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Player, Score, LeaderboardEntry } from "@/lib/types";
import { buildLeaderboard, calculateFromHoleScores } from "@/lib/scoring";
import { RaceTrack } from "@/components/horse-race/RaceTrack";

interface RaceReplayProps {
  players: Player[];
  scores: Score[];
  onExit: () => void;
}

export function RaceReplay({ players, scores, onExit }: RaceReplayProps) {
  const [currentHole, setCurrentHole] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Pre-compute 18 snapshots
  const snapshots = useMemo(() => {
    const result: LeaderboardEntry[][] = [];
    for (let h = 1; h <= 18; h++) {
      const partialScores: Score[] = [];

      for (const score of scores) {
        const player = players.find((p) => p.id === score.player_id);
        if (!player) continue;

        const partialHoles = score.hole_scores.filter((hs) => hs.hole <= h);
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

      result.push(buildLeaderboard(players, partialScores));
    }
    return result;
  }, [players, scores]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentHole((prev) => {
        if (prev >= 17) {
          stop();
          return 17;
        }
        return prev + 1;
      });
    }, 1200);
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setCurrentHole(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const entries = snapshots[currentHole] ?? [];

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <button
          onClick={isPlaying ? stop : play}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-green-900 font-bold text-sm hover:bg-yellow-300 transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
        >
          ↺ Reset
        </button>
        <div className="flex-1 text-center">
          <span className="text-yellow-400 font-bold">Hole {currentHole + 1}</span>
          <span className="text-white/40"> / 18</span>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
        >
          Exit Replay
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-4">
        <div
          className="h-1.5 bg-yellow-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentHole + 1) / 18) * 100}%` }}
        />
      </div>

      {/* Race track with current snapshot */}
      <RaceTrack entries={entries} />
    </div>
  );
}
