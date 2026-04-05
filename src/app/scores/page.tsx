"use client";

import { NavBar } from "@/components/NavBar";
import { ScoreGrid } from "@/components/ScoreGrid";
import { usePlayers } from "@/hooks/usePlayers";
import { useScores } from "@/hooks/useScores";

export default function ScoresPage() {
  const { players, loading: playersLoading } = usePlayers();
  const { scores, loading: scoresLoading, upsertScore } = useScores();

  const loading = playersLoading || scoresLoading;

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-2xl mx-auto">
        <h1
          className="text-2xl md:text-4xl mb-6 text-center"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          <span className="text-yellow-400">Enter</span>{" "}
          <span className="text-white">Scores</span>
        </h1>

        {loading ? (
          <div className="text-center text-white/40 animate-pulse py-12">
            Loading...
          </div>
        ) : (
          <ScoreGrid
            players={players}
            scores={scores}
            onScoreSubmit={upsertScore}
          />
        )}
      </main>
    </>
  );
}
