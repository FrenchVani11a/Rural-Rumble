"use client";

import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { Scorecard } from "@/components/Scorecard";
import { usePlayers } from "@/hooks/usePlayers";
import { useScores } from "@/hooks/useScores";
import { COURSES } from "@/lib/constants";

const STORAGE_KEY_PLAYER = "rr-selected-player";
const STORAGE_KEY_COURSE = "rr-selected-course";

export default function ScoresPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("waverley");
  const { players, loading: playersLoading } = usePlayers();
  const { scores, loading: scoresLoading, upsertScore, resetScore } = useScores(selectedCourseId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPlayer = localStorage.getItem(STORAGE_KEY_PLAYER);
    const savedCourse = localStorage.getItem(STORAGE_KEY_COURSE);
    if (savedPlayer) setSelectedPlayerId(savedPlayer);
    if (savedCourse) setSelectedCourseId(savedCourse);
    setInitialized(true);
  }, []);

  const selectPlayer = (id: string) => {
    setSelectedPlayerId(id);
    localStorage.setItem(STORAGE_KEY_PLAYER, id);
    setTimeout(() => {
      const el = document.getElementById(`player-pill-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, 50);
  };

  const selectCourse = (id: string) => {
    setSelectedCourseId(id);
    localStorage.setItem(STORAGE_KEY_COURSE, id);
  };

  const loading = playersLoading || scoresLoading || !initialized;
  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) ?? COURSES[0];
  const savedValid = selectedPlayerId && players.some((p) => p.id === selectedPlayerId);
  const activePlayerId = savedValid ? selectedPlayerId : players[0]?.id ?? null;
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
      <main className="max-w-3xl mx-auto">
        <div className="text-center px-4 pt-6 md:pt-10 mb-4">
          <h1
            className="text-2xl md:text-4xl mb-1"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">Enter</span>{" "}
            <span className="text-white">Scores</span>
          </h1>
        </div>

        {/* Course selector */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {COURSES.map((course) => (
              <button
                key={course.id}
                onClick={() => selectCourse(course.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0 transition-all text-sm font-medium ${
                  selectedCourseId === course.id
                    ? "bg-yellow-400/20 border border-yellow-400/50 text-yellow-400"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <span>{course.emoji}</span>
                <div className="text-left">
                  <div>{course.name}</div>
                  <div className="text-[10px] text-white/40">{course.holes} holes</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 px-1 text-white/30 text-xs">{activeCourse.format}</div>
        </div>

        {/* Sticky player selector */}
        <div
          ref={selectorRef}
          className="sticky top-[44px] md:top-[52px] z-40 bg-gradient-to-b from-[#0d2b0d] via-[#0d2b0d] to-transparent pb-4"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-hide">
            {players.map((player) => {
              const playerScore = scores.find((s) => s.player_id === player.id);
              const isActive = player.id === activePlayerId;

              return (
                <button
                  key={player.id}
                  id={`player-pill-${player.id}`}
                  onClick={() => selectPlayer(player.id)}
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
                      {playerScore ? `Thru ${playerScore.holes_played}` : "No scores"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scorecard */}
        <div className="px-4 pb-6 md:pb-10">
          {activePlayer && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Scorecard
                key={`${activePlayer.id}-${selectedCourseId}`}
                player={activePlayer}
                existingScore={activeScore}
                courseId={selectedCourseId}
                onSave={upsertScore}
                onReset={resetScore}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
