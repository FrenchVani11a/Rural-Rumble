"use client";

import { useState } from "react";
import { Player, Score } from "@/lib/types";
import { COURSE } from "@/lib/constants";

interface ScoreGridProps {
  players: Player[];
  scores: Score[];
  onScoreSubmit: (playerId: string, grossScore: number, handicap: number) => Promise<boolean>;
}

export function ScoreGrid({ players, scores, onScoreSubmit }: ScoreGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  const scoreMap = new Map(scores.map((s) => [s.player_id, s]));

  const handleSave = async (player: Player) => {
    if (!inputValue) return;
    setSaving(true);
    const success = await onScoreSubmit(player.id, parseInt(inputValue), player.handicap);
    if (success) {
      setEditingId(null);
      setInputValue("");
    }
    setSaving(false);
  };

  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="text-4xl mb-3">📝</p>
        <p>Add some players first, then come back to enter scores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Course header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex-1">
          <div className="text-white font-bold">{COURSE.name}</div>
          <div className="text-white/50 text-sm">
            Par {COURSE.par} &middot; {COURSE.holes} holes &middot; {COURSE.location}
          </div>
        </div>
      </div>

      {/* Player scores */}
      {players.map((player) => {
        const score = scoreMap.get(player.id);
        const isEditing = editingId === player.id;
        const netScore = score ? score.net_score : null;
        const toPar = netScore !== null ? netScore - COURSE.par : null;

        return (
          <div
            key={player.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            {/* Player info */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: player.avatar_color }}
            >
              {player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{player.name}</div>
              <div className="text-white/50 text-xs">HC {player.handicap}</div>
            </div>

            {/* Score area */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Gross"
                  inputMode="numeric"
                  min="40"
                  max="200"
                  autoFocus
                  className="w-20 px-3 py-2 rounded-lg bg-white/10 border border-yellow-400/50 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave(player);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setInputValue("");
                    }
                  }}
                />
                <button
                  onClick={() => handleSave(player)}
                  disabled={saving || !inputValue}
                  className="px-3 py-2 rounded-lg bg-yellow-400 text-green-900 font-bold text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setInputValue("");
                  }}
                  className="px-3 py-2 rounded-lg bg-white/10 text-white/50 text-sm hover:bg-white/20 transition-colors"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingId(player.id);
                  setInputValue(score?.gross_score?.toString() ?? "");
                }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                {score ? (
                  <>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {score.gross_score}
                      </div>
                      <div className="text-white/40 text-xs">gross</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {netScore}
                      </div>
                      <div className="text-white/40 text-xs">net</div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm font-bold ${
                        toPar! < 0
                          ? "bg-green-500/20 text-green-400"
                          : toPar === 0
                          ? "bg-white/10 text-white"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {toPar! > 0 ? "+" : ""}
                      {toPar === 0 ? "E" : toPar}
                    </div>
                  </>
                ) : (
                  <span className="text-white/40 text-sm group-hover:text-white/70">
                    Tap to enter score
                  </span>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
