"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Player, Score, HoleScore } from "@/lib/types";
import { HOLES, FRONT_NINE, BACK_NINE, COURSE, HoleInfo } from "@/lib/constants";
import { getStrokesForHole, calculateFromHoleScores } from "@/lib/scoring";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ScoreReaction {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

function getReactionEmoji(gross: number, par: number): string {
  const diff = gross - par;
  if (diff <= -2) return ["🦅", "🤯", "👑", "🔥"][Math.floor(Math.random() * 4)];
  if (diff === -1) return ["🐦", "💪", "😎", "👏"][Math.floor(Math.random() * 4)];
  if (diff === 0) return ["👍", "✅", "😌", "🤝"][Math.floor(Math.random() * 4)];
  if (diff === 1) return ["😬", "💨", "🫣", "😅"][Math.floor(Math.random() * 4)];
  if (diff === 2) return ["💩", "😭", "🤮", "📉"][Math.floor(Math.random() * 4)];
  return ["💀", "🪦", "🚑", "🏳️", "😵‍💫", "🤡"][Math.floor(Math.random() * 6)];
}

interface ScorecardProps {
  player: Player;
  existingScore: Score | null;
  onSave: (playerId: string, holeScores: HoleScore[], handicap: number) => Promise<boolean>;
  onReset?: (playerId: string) => Promise<boolean>;
}

function scoreCellColor(gross: number, par: number): string {
  const diff = gross - par;
  if (diff <= -2) return "bg-yellow-400 text-yellow-900"; // eagle or better
  if (diff === -1) return "bg-green-500 text-white"; // birdie
  if (diff === 0) return "bg-white/10 text-white"; // par
  if (diff === 1) return "bg-red-400/30 text-red-300"; // bogey
  return "bg-red-600/40 text-red-200"; // double+
}

export function Scorecard({ player, existingScore, onSave, onReset }: ScorecardProps) {
  const [holeScores, setHoleScores] = useState<Map<number, number>>(new Map());
  const [editingHole, setEditingHole] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [reactions, setReactions] = useState<ScoreReaction[]>([]);
  const reactionIdRef = useRef(0);
  const { playSoundForScore } = useSoundEffects();
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load existing scores
  useEffect(() => {
    const map = new Map<number, number>();
    if (existingScore?.hole_scores) {
      for (const hs of existingScore.hole_scores) {
        map.set(hs.hole, hs.gross);
      }
    }
    setHoleScores(map);
  }, [existingScore]);

  // Focus input when editing
  useEffect(() => {
    if (editingHole !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingHole]);

  const doSave = (updatedMap: Map<number, number>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const scores: HoleScore[] = [];
      updatedMap.forEach((gross, hole) => {
        scores.push({ hole, gross });
      });
      scores.sort((a, b) => a.hole - b.hole);
      setSaving(true);
      await onSave(player.id, scores, player.handicap);
      setSaving(false);
    }, 500);
  };

  const setScore = (hole: number, gross: number) => {
    const updated = new Map(holeScores);
    updated.set(hole, gross);
    setHoleScores(updated);
    doSave(updated);
  };

  const handleCellClick = (hole: number) => {
    setEditingHole(hole);
    setInputValue(holeScores.get(hole)?.toString() ?? "");
  };

  const commitEdit = () => {
    if (editingHole === null) return;
    const val = parseInt(inputValue);
    if (!isNaN(val) && val >= 1 && val <= 15) {
      setScore(editingHole, val);
      // Play sound + show reaction based on score vs par
      const holePar = HOLES[editingHole - 1].par;
      playSoundForScore(val, holePar);
      const id = ++reactionIdRef.current;
      const emoji = getReactionEmoji(val, holePar);
      setReactions((prev) => [
        ...prev,
        { id, emoji, x: 30 + Math.random() * 40, y: 20 + Math.random() * 20 },
      ]);
      setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 1500);
      // Auto-advance to next hole
      if (editingHole < 18) {
        const next = editingHole + 1;
        setEditingHole(next);
        setInputValue(holeScores.get(next)?.toString() ?? "");
      } else {
        setEditingHole(null);
      }
    } else {
      setEditingHole(null);
    }
  };

  // Compute totals
  const allHoleScores: HoleScore[] = [];
  holeScores.forEach((gross, hole) => allHoleScores.push({ hole, gross }));
  const { grossTotal, netTotal, holesPlayed, parPlayed } = calculateFromHoleScores(
    allHoleScores,
    player.handicap
  );

  const frontGross = FRONT_NINE.reduce((s, h) => s + (holeScores.get(h.hole) ?? 0), 0);
  const backGross = BACK_NINE.reduce((s, h) => s + (holeScores.get(h.hole) ?? 0), 0);
  const frontHolesPlayed = FRONT_NINE.filter((h) => holeScores.has(h.hole)).length;
  const backHolesPlayed = BACK_NINE.filter((h) => holeScores.has(h.hole)).length;

  const renderNine = (holes: HoleInfo[], label: string, ninePar: number, nineGross: number, nineHoles: number) => (
    <div className="mb-6">
      <div className="text-white/50 text-xs uppercase tracking-wider mb-2 px-1">{label}</div>
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[540px] text-center text-sm">
          <thead>
            <tr className="text-white/40 text-xs">
              <th className="w-14 py-1.5 text-left pl-2">Hole</th>
              {holes.map((h) => (
                <th key={h.hole} className="w-10 py-1.5">{h.hole}</th>
              ))}
              <th className="w-14 py-1.5 font-bold text-white/60">Tot</th>
            </tr>
            <tr className="text-white/50 text-xs border-b border-white/10">
              <td className="py-1 text-left pl-2">Par</td>
              {holes.map((h) => (
                <td key={h.hole} className="py-1">{h.par}</td>
              ))}
              <td className="py-1 font-bold text-white/60">{ninePar}</td>
            </tr>
            <tr className="text-white/30 text-[10px] border-b border-white/10">
              <td className="py-1 text-left pl-2">SI</td>
              {holes.map((h) => (
                <td key={h.hole} className="py-1">{h.strokeIndex}</td>
              ))}
              <td className="py-1"></td>
            </tr>
            <tr className="text-white/30 text-[10px] border-b border-white/10">
              <td className="py-1 text-left pl-2">Yds</td>
              {holes.map((h) => (
                <td key={h.hole} className="py-1">{h.yards}</td>
              ))}
              <td className="py-1"></td>
            </tr>
          </thead>
          <tbody>
            {/* Strokes received row */}
            <tr className="text-yellow-400/70 text-[10px] border-b border-white/5">
              <td className="py-1 text-left pl-2">Shots</td>
              {holes.map((h) => {
                const strokes = getStrokesForHole(player.handicap, h.strokeIndex);
                return (
                  <td key={h.hole} className="py-1">
                    {strokes > 0 ? (
                      <span>{Array(strokes).fill("●").join("")}</span>
                    ) : null}
                  </td>
                );
              })}
              <td className="py-1"></td>
            </tr>
            {/* Score entry row */}
            <tr className="border-b border-white/10">
              <td className="py-1.5 text-left pl-2 text-white font-bold text-xs">Score</td>
              {holes.map((h) => {
                const gross = holeScores.get(h.hole);
                const isEditing = editingHole === h.hole;

                return (
                  <td key={h.hole} className="py-1.5 px-0.5">
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") setEditingHole(null);
                          if (e.key === "Tab") {
                            e.preventDefault();
                            commitEdit();
                          }
                        }}
                        onBlur={commitEdit}
                        className="w-9 h-9 rounded-lg bg-yellow-400/20 border border-yellow-400 text-white text-center text-sm font-bold focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => handleCellClick(h.hole)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                          gross !== undefined
                            ? scoreCellColor(gross, h.par)
                            : "bg-white/5 text-white/20 hover:bg-white/10"
                        }`}
                      >
                        {gross ?? "-"}
                      </button>
                    )}
                  </td>
                );
              })}
              <td className="py-1.5">
                <span className="text-white font-bold text-sm">
                  {nineHoles > 0 ? nineGross : "-"}
                </span>
              </td>
            </tr>
            {/* Net row */}
            <tr>
              <td className="py-1 text-left pl-2 text-white/40 text-xs">Net</td>
              {holes.map((h) => {
                const gross = holeScores.get(h.hole);
                if (gross === undefined) return <td key={h.hole} className="py-1 text-white/20 text-xs">-</td>;
                const strokes = getStrokesForHole(player.handicap, h.strokeIndex);
                const net = gross - strokes;
                const diff = net - h.par;
                return (
                  <td key={h.hole} className={`py-1 text-xs font-medium ${
                    diff < 0 ? "text-green-400" : diff === 0 ? "text-white/60" : "text-red-400"
                  }`}>
                    {net}
                  </td>
                );
              })}
              <td className="py-1">
                {nineHoles > 0 && (
                  <span className="text-white/60 font-medium text-xs">
                    {holes.reduce((s, h) => {
                      const gross = holeScores.get(h.hole);
                      if (gross === undefined) return s;
                      return s + gross - getStrokesForHole(player.handicap, h.strokeIndex);
                    }, 0)}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const toPar = holesPlayed > 0 ? netTotal - parPlayed : null;

  return (
    <div className="relative">
      {/* Floating emoji reactions */}
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 2.5, y: -120, rotate: Math.random() * 40 - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute z-50 text-4xl pointer-events-none"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Player header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: player.avatar_color }}
        >
          {player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="text-white font-bold">{player.name}</div>
          <div className="text-white/50 text-sm">Handicap {player.handicap}</div>
        </div>
        <div className="text-right">
          {holesPlayed > 0 && (
            <>
              <div className="text-white font-bold text-lg">
                Net {netTotal}
                {toPar !== null && (
                  <span className={`ml-2 text-sm ${
                    toPar < 0 ? "text-green-400" : toPar === 0 ? "text-white/60" : "text-red-400"
                  }`}>
                    ({toPar > 0 ? "+" : ""}{toPar === 0 ? "E" : toPar})
                  </span>
                )}
              </div>
              <div className="text-white/40 text-xs">
                Gross {grossTotal} &middot; Thru {holesPlayed}
              </div>
            </>
          )}
        </div>
        {saving && (
          <div className="text-yellow-400/60 text-xs animate-pulse">Saving...</div>
        )}
      </div>

      {/* Scorecard tables */}
      {renderNine(FRONT_NINE, "Front 9", COURSE.frontNinePar, frontGross, frontHolesPlayed)}
      {renderNine(BACK_NINE, "Back 9", COURSE.backNinePar, backGross, backHolesPlayed)}

      {/* Totals summary */}
      {holesPlayed > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-2">
          <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
            <div className="text-white/40 text-[10px] uppercase">Gross</div>
            <div className="text-white font-bold text-lg">{grossTotal}</div>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
            <div className="text-white/40 text-[10px] uppercase">Net</div>
            <div className="text-white font-bold text-lg">{netTotal}</div>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
            <div className="text-white/40 text-[10px] uppercase">To Par</div>
            <div className={`font-bold text-lg ${
              toPar! < 0 ? "text-green-400" : toPar === 0 ? "text-white" : "text-red-400"
            }`}>
              {toPar! > 0 ? "+" : ""}{toPar === 0 ? "E" : toPar}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 text-center">
            <div className="text-white/40 text-[10px] uppercase">Thru</div>
            <div className="text-white font-bold text-lg">{holesPlayed}</div>
          </div>
        </div>
      )}

      {/* Reset scores button */}
      {onReset && holesPlayed > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          {confirmingReset ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-red-400 text-sm">Clear all scores for {player.name}?</span>
              <button
                onClick={async () => {
                  setConfirmingReset(false);
                  if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
                  await onReset(player.id);
                  setHoleScores(new Map());
                }}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Yes, reset
              </button>
              <button
                onClick={() => {
                  setConfirmingReset(false);
                  if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setConfirmingReset(true);
                resetTimerRef.current = setTimeout(() => setConfirmingReset(false), 5000);
              }}
              className="w-full py-2 rounded-lg bg-white/5 text-white/30 text-sm hover:bg-white/10 hover:text-white/50 transition-colors"
            >
              Reset Scores
            </button>
          )}
        </div>
      )}
    </div>
  );
}
