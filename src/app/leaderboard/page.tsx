"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { RaceTrack } from "@/components/horse-race/RaceTrack";
import { RaceReplay } from "@/components/RaceReplay";
import { HoleSelector } from "@/components/HoleSelector";
import { Awards } from "@/components/Awards";
import { ChatBoard } from "@/components/ChatBoard";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import { useConfetti } from "@/hooks/useConfetti";
import { COURSE } from "@/lib/constants";

export default function LeaderboardPage() {
  const { leaderboard, loading, players, scores } = useRealtimeLeaderboard();
  const [replayMode, setReplayMode] = useState(false);
  const [selectedHole, setSelectedHole] = useState(0); // 0 = live

  const leaderId =
    leaderboard.length > 0 && leaderboard[0].score
      ? leaderboard[0].player.id
      : null;
  useConfetti(leaderId);

  const hasScores = leaderboard.some((e) => e.score);

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1
            className="text-2xl md:text-4xl mb-1"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">The Race</span>{" "}
            <span className="text-white">Is On</span>
          </h1>
          <p className="text-white/50 text-sm">
            {COURSE.name} &middot; Par {COURSE.par} &middot; Live positions
          </p>
          {hasScores && !replayMode && (
            <button
              onClick={() => setReplayMode(true)}
              className="mt-3 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
            >
              🎬 Watch Replay
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/40 text-lg animate-pulse">
              Loading the race...
            </div>
          </div>
        ) : (
          <>
            {/* Race track, replay, or hole selector */}
            {replayMode ? (
              <RaceReplay
                players={players}
                scores={scores}
                onExit={() => setReplayMode(false)}
              />
            ) : (
              <>
                {/* Hole selector */}
                {hasScores && (
                  <HoleSelector
                    players={players}
                    scores={scores}
                    selectedHole={selectedHole}
                    onHoleChange={setSelectedHole}
                  />
                )}

                {/* Live race track (shown when hole selector is on LIVE or no scores) */}
                {selectedHole === 0 && <RaceTrack entries={leaderboard} />}
              </>
            )}

            {/* Score table */}
            {hasScores && (
              <div className="mt-8 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">Pos</th>
                        <th className="px-4 py-3 text-left">Player</th>
                        <th className="px-3 py-3 text-center">Thru</th>
                        <th className="px-4 py-3 text-right">Gross</th>
                        <th className="px-4 py-3 text-right">Net</th>
                        <th className="px-4 py-3 text-right">To Par</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => {
                        const toPar = entry.score
                          ? entry.score.net_score -
                            (entry.score.par_played || COURSE.par)
                          : null;
                        return (
                          <tr
                            key={entry.player.id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                  entry.rank === 1
                                    ? "bg-yellow-400 text-yellow-900"
                                    : entry.rank === 2
                                    ? "bg-gray-300 text-gray-800"
                                    : entry.rank === 3
                                    ? "bg-amber-600 text-white"
                                    : "bg-white/10 text-white/60"
                                }`}
                              >
                                {entry.rank}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                  style={{
                                    backgroundColor: entry.player.avatar_color,
                                  }}
                                >
                                  {entry.player.name
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">
                                    {entry.player.name}
                                  </div>
                                  <div className="text-white/40 text-xs">
                                    HC {entry.player.handicap}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center text-white/50 text-sm">
                              {entry.score?.holes_played ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-right text-white/70 text-sm">
                              {entry.score?.gross_score ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-right text-white font-bold text-sm">
                              {entry.score?.net_score ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {toPar !== null ? (
                                <span
                                  className={`px-2 py-1 rounded text-sm font-bold ${
                                    toPar < 0
                                      ? "bg-green-500/20 text-green-400"
                                      : toPar === 0
                                      ? "bg-white/10 text-white"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {toPar > 0 ? "+" : ""}
                                  {toPar === 0 ? "E" : toPar}
                                </span>
                              ) : (
                                <span className="text-white/30">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Awards & Side Bets */}
            <Awards players={players} scores={scores} />

            {/* Trash Talk */}
            <ChatBoard />
          </>
        )}
      </main>
    </>
  );
}
