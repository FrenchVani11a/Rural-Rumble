"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { RaceTrack } from "@/components/horse-race/RaceTrack";
import { RaceReplay } from "@/components/RaceReplay";
import { HoleSelector } from "@/components/HoleSelector";
import { Awards } from "@/components/Awards";
import { ChatBoard } from "@/components/ChatBoard";
import { MatchPlayBoard } from "@/components/MatchPlayBoard";
import { SeriesScore } from "@/components/SeriesScore";
import { PunishmentTracker } from "@/components/PunishmentTracker";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import { useConfetti } from "@/hooks/useConfetti";
import { useCanCounts } from "@/hooks/useCanCounts";
import { buildLeaderboard } from "@/lib/scoring";
import { COURSES } from "@/lib/constants";

type Tab = "overall" | "waverley" | "whanganui" | "rangatira";

export default function LeaderboardPage() {
  const { leaderboard: allLeaderboard, loading, players, scores } = useRealtimeLeaderboard();
  const { totalForPlayer } = useCanCounts();
  const [tab, setTab] = useState<Tab>("overall");
  const [replayMode, setReplayMode] = useState(false);
  const [selectedHole, setSelectedHole] = useState(0);

  const leaderId =
    allLeaderboard.length > 0 && allLeaderboard[0].score
      ? allLeaderboard[0].player.id
      : null;
  useConfetti(leaderId);

  const courseScores = scores.filter((s) => s.course_id === tab);
  const leaderboard = tab === "overall" ? allLeaderboard : buildLeaderboard(players, courseScores);
  const hasScores = leaderboard.some((e) => e.score);
  const activeCourse = COURSES.find((c) => c.id === tab);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "overall", label: "Overall", emoji: "🏆" },
    ...COURSES.map((c) => ({ id: c.id as Tab, label: c.name.split(" ")[0], emoji: c.emoji })),
  ];

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1
            className="text-2xl md:text-4xl mb-1"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">The Race</span>{" "}
            <span className="text-white">Is On</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setReplayMode(false); setSelectedHole(0); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap shrink-0 text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-yellow-400/20 border border-yellow-400/50 text-yellow-400"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/40 text-lg animate-pulse">Loading the race...</div>
          </div>
        ) : (
          <>
            {/* Overall tab */}
            {tab === "overall" && (
              <SeriesScore players={players} scores={scores} />
            )}

            {/* Course-specific match play */}
            {tab !== "overall" && activeCourse && tab !== "rangatira" && (
              <MatchPlayBoard players={players} scores={courseScores} courseId={tab} />
            )}

            {/* Race / replay (course tabs only) */}
            {tab !== "overall" && (
              <div className="mt-6">
                {replayMode ? (
                  <RaceReplay players={players} scores={courseScores} onExit={() => setReplayMode(false)} />
                ) : (
                  <>
                    {hasScores && (
                      <HoleSelector players={players} scores={courseScores} selectedHole={selectedHole} onHoleChange={setSelectedHole} />
                    )}
                    {selectedHole === 0 && <RaceTrack entries={leaderboard} />}
                    {hasScores && !replayMode && (
                      <div className="text-center mt-3">
                        <button
                          onClick={() => setReplayMode(true)}
                          className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
                        >
                          🎬 Watch Replay
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Score table */}
            {hasScores && (
              <div className="mt-6 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
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
                        {tab === "whanganui" && <th className="px-3 py-3 text-center">🍺</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => {
                        const coursePar = activeCourse ? (activeCourse.holes === 9 ? 36 : 71) : 71;
                        const toPar = entry.score
                          ? entry.score.net_score - (entry.score.par_played || coursePar)
                          : null;
                        return (
                          <tr key={entry.player.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                entry.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                                entry.rank === 2 ? "bg-gray-300 text-gray-800" :
                                entry.rank === 3 ? "bg-amber-600 text-white" :
                                "bg-white/10 text-white/60"
                              }`}>
                                {entry.rank}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                  style={{ backgroundColor: entry.player.avatar_color }}
                                >
                                  {entry.player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">{entry.player.name}</div>
                                  <div className="text-white/40 text-xs">HC {entry.player.handicap}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center text-white/50 text-sm">{entry.score?.holes_played ?? "-"}</td>
                            <td className="px-4 py-3 text-right text-white/70 text-sm">{entry.score?.gross_score ?? "-"}</td>
                            <td className="px-4 py-3 text-right text-white font-bold text-sm">{entry.score?.net_score ?? "-"}</td>
                            <td className="px-4 py-3 text-right">
                              {toPar !== null ? (
                                <span className={`px-2 py-1 rounded text-sm font-bold ${
                                  toPar < 0 ? "bg-green-500/20 text-green-400" :
                                  toPar === 0 ? "bg-white/10 text-white" :
                                  "bg-red-500/20 text-red-400"
                                }`}>
                                  {toPar > 0 ? "+" : ""}{toPar === 0 ? "E" : toPar}
                                </span>
                              ) : <span className="text-white/30">-</span>}
                            </td>
                            {tab === "whanganui" && (
                              <td className="px-3 py-3 text-center">
                                <span className="text-amber-400 font-bold text-sm">
                                  {totalForPlayer(entry.player.id) || "-"}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Punishment Tracker */}
            <PunishmentTracker players={players} courseId={tab === "overall" ? "general" : tab} />

            {/* Awards */}
            {tab !== "overall" && (
              <Awards players={players} scores={courseScores} />
            )}

            {/* Trash Talk */}
            <ChatBoard />
          </>
        )}
      </main>
    </>
  );
}
