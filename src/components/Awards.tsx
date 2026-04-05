"use client";

import { Player, Score } from "@/lib/types";
import {
  AwardResult,
  computeHaheiHorror,
  computeBestPar3,
  computeBack9Bandit,
  computeBirdieKing,
  computeBogeyTrain,
  computeSteadyEddie,
} from "@/lib/scoring";

interface AwardDef {
  name: string;
  emoji: string;
  color: string;
  compute: (players: Player[], scores: Score[]) => AwardResult | null;
}

const AWARDS: AwardDef[] = [
  { name: "The Hahei Horror", emoji: "😱", color: "text-red-400", compute: computeHaheiHorror },
  { name: "Best Par 3", emoji: "🎯", color: "text-teal-400", compute: computeBestPar3 },
  { name: "Back 9 Bandit", emoji: "🦹", color: "text-purple-400", compute: computeBack9Bandit },
  { name: "Birdie King", emoji: "🐦", color: "text-green-400", compute: computeBirdieKing },
  { name: "Bogey Train", emoji: "🚂", color: "text-orange-400", compute: computeBogeyTrain },
  { name: "Steady Eddie", emoji: "⚖️", color: "text-blue-400", compute: computeSteadyEddie },
];

export function Awards({ players, scores }: { players: Player[]; scores: Score[] }) {
  const results = AWARDS.map((award) => ({
    ...award,
    result: award.compute(players, scores),
  }));

  const hasAny = results.some((r) => r.result !== null);
  if (!hasAny) return null;

  return (
    <section className="mt-10">
      <h2
        className="text-xl md:text-2xl mb-4 text-center"
        style={{ fontFamily: "var(--font-bungee)" }}
      >
        <span className="text-yellow-400">Awards</span>{" "}
        <span className="text-white">& Side Bets</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((award) => (
          <div
            key={award.name}
            className={`rounded-2xl bg-white/5 border border-white/10 px-4 py-4 ${
              award.result ? "" : "opacity-30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{award.emoji}</span>
              <span className={`font-bold text-sm ${award.color}`}>
                {award.name}
              </span>
            </div>
            {award.result ? (
              <>
                <div className="text-white font-bold text-lg">
                  {award.result.playerName}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-bold ${award.color}`}>
                    {award.result.value}
                  </span>
                  <span className="text-white/40 text-sm">
                    {award.result.detail}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-white/30 text-sm">No qualifying scores yet</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
