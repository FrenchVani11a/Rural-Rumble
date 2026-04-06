"use client";

import { useMemo } from "react";
import { NavBar } from "@/components/NavBar";
import { HoleCard } from "@/components/course-map/HoleCard";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import { HOLES, COURSE } from "@/lib/constants";
import {
  buildPlayerHoleResults,
  generateHoleCommentary,
} from "@/lib/course-commentary";

// Serpentine row layout: groups of 3, alternating direction
const ROWS = [
  { holes: [0, 1, 2], reversed: false },     // 1, 2, 3
  { holes: [3, 4, 5], reversed: true },       // 6, 5, 4
  { holes: [6, 7, 8], reversed: false },      // 7, 8, 9
  // --- THE TURN ---
  { holes: [9, 10, 11], reversed: false },    // 10, 11, 12
  { holes: [12, 13, 14], reversed: true },    // 15, 14, 13
  { holes: [15, 16, 17], reversed: false },   // 16, 17, 18
];

function TrailConnector({ reversed }: { reversed?: boolean }) {
  return (
    <div className="hidden md:flex col-span-3 justify-center py-1">
      <svg width="200" height="28" className="text-yellow-400/20" aria-hidden="true">
        <path
          d={
            reversed
              ? "M 20 2 C 20 14, 100 14, 100 14 C 100 14, 180 14, 180 26"
              : "M 180 2 C 180 14, 100 14, 100 14 C 100 14, 20 14, 20 26"
          }
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
        />
      </svg>
    </div>
  );
}

function MobileConnector({ index }: { index: number }) {
  const offsetLeft = index % 2 === 0;
  return (
    <div className="md:hidden flex py-1" style={{ justifyContent: offsetLeft ? "flex-start" : "flex-end", paddingLeft: offsetLeft ? "40px" : "0", paddingRight: offsetLeft ? "0" : "40px" }}>
      <svg width="30" height="28" className="text-yellow-400/20" aria-hidden="true">
        <path
          d={offsetLeft ? "M 15 0 C 15 14, 25 14, 25 28" : "M 15 0 C 15 14, 5 14, 5 28"}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>
    </div>
  );
}

function TheTurn() {
  return (
    <div className="col-span-1 md:col-span-3 flex items-center gap-4 py-6 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      <div className="text-center shrink-0">
        <div
          className="text-yellow-400 text-sm"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          THE TURN
        </div>
        <div className="text-white/30 text-[11px]">
          Front 9 done &middot; Back 9 ahead
        </div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
    </div>
  );
}

export default function CourseMapPage() {
  const { players, scores, loading } = useRealtimeLeaderboard();

  // Build a map of player_id -> hole_scores array
  const scoreMap = useMemo(() => {
    const map = new Map<string, { hole: number; gross: number }[]>();
    for (const score of scores) {
      map.set(score.player_id, score.hole_scores);
    }
    return map;
  }, [scores]);

  // Pre-compute all hole data
  const holeData = useMemo(() => {
    return HOLES.map((hole) => {
      const playerScores = buildPlayerHoleResults(hole, players, scoreMap);
      const commentary = generateHoleCommentary(hole, playerScores);
      return { hole, playerScores, commentary };
    });
  }, [players, scoreMap]);

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl md:text-4xl mb-1"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">Course</span>{" "}
            <span className="text-white">Map</span>
          </h1>
          <p className="text-white/50 text-sm">
            {COURSE.name} &middot; Par {COURSE.par} &middot; 18 holes of chaos
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500/40" />
              Par 3
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
              Par 4
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500/40" />
              Par 5
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/40 text-lg animate-pulse">
              Loading the course...
            </div>
          </div>
        ) : (
          <>
            {/* Desktop: serpentine 3-col grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-4">
                {ROWS.map((row, rowIdx) => {
                  // Insert "The Turn" after front 9 (rowIdx === 3 means we're starting back 9)
                  const showTurn = rowIdx === 3;
                  const displayOrder = row.reversed
                    ? [...row.holes].reverse()
                    : row.holes;

                  return (
                    <div key={rowIdx} className="contents">
                      {showTurn && <TheTurn />}
                      {displayOrder.map((holeIdx) => {
                        const data = holeData[holeIdx];
                        return (
                          <HoleCard
                            key={data.hole.hole}
                            hole={data.hole}
                            playerScores={data.playerScores}
                            commentary={data.commentary}
                            index={holeIdx}
                          />
                        );
                      })}
                      {/* Trail connector between rows (not after last row) */}
                      {rowIdx < ROWS.length - 1 && rowIdx !== 2 && (
                        <TrailConnector reversed={row.reversed} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Clubhouse */}
              <div className="text-center mt-8 pb-4">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div
                      className="text-yellow-400 text-sm"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      Clubhouse
                    </div>
                    <div className="text-white/30 text-[11px]">
                      Time for a cold one
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: single column with winding trail */}
            <div className="md:hidden space-y-0">
              {holeData.map((data, idx) => (
                <div key={data.hole.hole}>
                  {/* The Turn divider between hole 9 and 10 */}
                  {idx === 9 && <TheTurn />}

                  {/* Winding offset */}
                  <div
                    style={{
                      marginLeft: idx % 2 === 0 ? "0" : "12px",
                      marginRight: idx % 2 === 0 ? "12px" : "0",
                    }}
                  >
                    <HoleCard
                      hole={data.hole}
                      playerScores={data.playerScores}
                      commentary={data.commentary}
                      index={idx}
                    />
                  </div>

                  {/* Connector between cards */}
                  {idx < holeData.length - 1 && idx !== 8 && (
                    <MobileConnector index={idx} />
                  )}
                </div>
              ))}

              {/* Clubhouse */}
              <div className="text-center mt-6 pb-4">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div
                      className="text-yellow-400 text-sm"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      Clubhouse
                    </div>
                    <div className="text-white/30 text-[11px]">
                      Time for a cold one
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
