"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Scorecard } from "@/components/Scorecard";
import { usePlayers } from "@/hooks/usePlayers";
import { useScores } from "@/hooks/useScores";
import { COURSE } from "@/lib/constants";

export default function ScoresPage() {
  const { players, loading: playersLoading } = usePlayers();
  const { scores, loading: scoresLoading, upsertScore } = useScores();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const loading = playersLoading || scoresLoading;

  // Auto-select first player if none selected
  const activePlayerId = selectedPlayerId ?? players[0]?.id ?? null;
  const activePlayer = players.find((p) => p.id === activePlayerId) ?? null;
  const activeScore = scores.find((s) => s.player_id === activePlayerId) ?? null;

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="px-4 py-6 md:py-10 max-w-3xl mx-auto">
          <div className="text-center text-white/40 animate-pulse py-12">Loading...</div>
        </main>
      </>
    );
  }

  if (players.length === 0) {
    return (
      <>
        <NavBar />
        <main className="px-4 py-6 md:py-10 max-w-3xl mx-auto">
          <h1
            className="text-2xl md:text-4xl mb-6 text-center"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">Enter</span>{" "}
            <span className="text-white">Scores</span>
          </h1>
          <div className="text-center py-12 text-white/40">
            <p className="text-4xl mb-3">📝</p>
            <p>Add some players first, then come back to enter scores.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1
            className="text-2xl md:text-4xl mb-1"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">Enter</span>{" "}
            <span className="text-white">Scores</span>
          </h1>
          <p className="text-white/50 text-sm">
            {COURSE.name} &middot; Par {COURSE.par}
          </p>
        </div>

        {/* Player selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 scrollbar-hide">
          {players.map((player) => {
            const playerScore = scores.find((s) => s.player_id === player.id);
            const isActive = player.id === activePlayerId;

            return (
              <button
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? "bg-yellow-400/20 border border-yellow-400/50 text-yellow-400"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: player.avatar_color }}
                >
                  {player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-[10px] text-white/40">
                    {playerScore
                      ? `Thru ${playerScore.holes_played}`
                      : "No scores"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scorecard for selected player */}
        {activePlayer && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Scorecard
              key={activePlayer.id}
              player={activePlayer}
              existingScore={activeScore}
              onSave={upsertScore}
            />
          </div>
        )}
      </main>
    </>
  );
}
