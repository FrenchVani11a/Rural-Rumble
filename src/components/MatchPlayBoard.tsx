"use client";

import { Player, Score } from "@/lib/types";
import { HOLES, TEAMS } from "@/lib/constants";
import { getStrokesForHole } from "@/lib/scoring";

interface Props {
  players: Player[];
  scores: Score[];
  courseId: string;
}

function getTeamPlayers(players: Player[], teamIndex: number) {
  const names = TEAMS[teamIndex].players;
  return players.filter((p) => (names as readonly string[]).includes(p.name));
}

function getNetScore(gross: number, handicap: number, strokeIndex: number, useHandicap: boolean) {
  if (!useHandicap) return gross;
  return gross - getStrokesForHole(handicap, strokeIndex);
}

export function MatchPlayBoard({ players, scores, courseId }: Props) {
  const useHandicap = courseId !== "whanganui";
  const maxHoles = courseId === "whanganui" ? 9 : 18;

  const teamA = getTeamPlayers(players, 0);
  const teamB = getTeamPlayers(players, 1);

  if (teamA.length === 0 || teamB.length === 0) return null;

  const scoreMap = new Map(scores.map((s) => [s.player_id, s]));

  // Calculate hole results
  const holeResults: Array<"A" | "B" | "H" | null> = [];
  let runningScore = 0; // positive = Team A up, negative = Team B up
  const runningByHole: number[] = [];

  for (let h = 1; h <= maxHoles; h++) {
    const holeInfo = HOLES[h - 1];

    const teamANets = teamA
      .map((p) => {
        const sc = scoreMap.get(p.id);
        const hs = sc?.hole_scores.find((x) => x.hole === h);
        if (!hs) return null;
        return getNetScore(hs.gross, p.handicap, holeInfo.strokeIndex, useHandicap);
      })
      .filter((v): v is number => v !== null);

    const teamBNets = teamB
      .map((p) => {
        const sc = scoreMap.get(p.id);
        const hs = sc?.hole_scores.find((x) => x.hole === h);
        if (!hs) return null;
        return getNetScore(hs.gross, p.handicap, holeInfo.strokeIndex, useHandicap);
      })
      .filter((v): v is number => v !== null);

    if (teamANets.length === 0 || teamBNets.length === 0) {
      holeResults.push(null);
      runningByHole.push(runningScore);
      continue;
    }

    const bestA = Math.min(...teamANets);
    const bestB = Math.min(...teamBNets);

    if (bestA < bestB) { holeResults.push("A"); runningScore++; }
    else if (bestB < bestA) { holeResults.push("B"); runningScore--; }
    else { holeResults.push("H"); }

    runningByHole.push(runningScore);
  }

  const holesPlayed = holeResults.filter((r) => r !== null).length;
  const finalScore = runningByHole[holesPlayed - 1] ?? 0;

  const statusText = () => {
    if (holesPlayed === 0) return "Not started";
    const remaining = maxHoles - holesPlayed;
    if (finalScore === 0) return `All Square thru ${holesPlayed}`;
    const leader = finalScore > 0 ? TEAMS[0].name : TEAMS[1].name;
    const holes = Math.abs(finalScore);
    if (holes > remaining && holesPlayed < maxHoles) return `${leader} wins (${holes}&${remaining})`;
    return `${leader} ${holes}UP thru ${holesPlayed}`;
  };

  return (
    <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">⚔️ Match Play</h3>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          finalScore > 0 ? "bg-red-500/20 text-red-400" :
          finalScore < 0 ? "bg-pink-500/20 text-pink-400" :
          "bg-white/10 text-white/60"
        }`}>
          {statusText()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs min-w-[480px]">
          <thead>
            <tr className="text-white/30 border-b border-white/10">
              <th className="px-3 py-2 text-left w-24">Team</th>
              {Array.from({ length: maxHoles }, (_, i) => (
                <th key={i + 1} className="px-1 py-2 w-7">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-3 py-2 text-left">
                <span className="text-xs font-bold" style={{ color: TEAMS[0].color }}>{TEAMS[0].emoji} {TEAMS[0].name}</span>
              </td>
              {holeResults.map((result, i) => (
                <td key={i} className="px-1 py-2">
                  {result === "A" ? <span className="inline-block w-5 h-5 rounded-full bg-red-500/30 text-red-400 font-bold flex items-center justify-center">W</span> :
                   result === "B" ? <span className="text-white/20">L</span> :
                   result === "H" ? <span className="text-white/30">½</span> :
                   <span className="text-white/10">·</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-3 py-2 text-left">
                <span className="text-xs font-bold" style={{ color: TEAMS[1].color }}>{TEAMS[1].emoji} {TEAMS[1].name}</span>
              </td>
              {holeResults.map((result, i) => (
                <td key={i} className="px-1 py-2">
                  {result === "B" ? <span className="inline-block w-5 h-5 rounded-full bg-pink-500/30 text-pink-400 font-bold flex items-center justify-center">W</span> :
                   result === "A" ? <span className="text-white/20">L</span> :
                   result === "H" ? <span className="text-white/30">½</span> :
                   <span className="text-white/10">·</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
