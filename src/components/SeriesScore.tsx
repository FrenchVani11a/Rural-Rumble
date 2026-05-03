"use client";

import { Player, Score } from "@/lib/types";
import { COURSES, TEAMS } from "@/lib/constants";
import { getStrokesForHole } from "@/lib/scoring";
import { HOLES } from "@/lib/constants";

interface Props {
  players: Player[];
  scores: Score[];
}

function getTeamPlayers(players: Player[], teamIndex: number) {
  const names = TEAMS[teamIndex].players;
  return players.filter((p) => names.includes(p.name as typeof names[number]));
}

function teamNetTotal(teamPlayers: Player[], courseScores: Score[], useHandicap: boolean): number | null {
  const totals = teamPlayers.map((p) => {
    const sc = courseScores.find((s) => s.player_id === p.id);
    if (!sc || sc.holes_played === 0) return null;
    if (!useHandicap) return sc.gross_score;
    let net = 0;
    for (const hs of sc.hole_scores) {
      const hi = HOLES[hs.hole - 1];
      net += hs.gross - getStrokesForHole(p.handicap, hi.strokeIndex);
    }
    return net;
  });
  const valid = totals.filter((t): t is number => t !== null);
  if (valid.length === 0) return null;
  return Math.min(...valid); // best ball of team
}

export function SeriesScore({ players, scores }: Props) {
  const teamA = getTeamPlayers(players, 0);
  const teamB = getTeamPlayers(players, 1);

  let aPoints = 0;
  let bPoints = 0;

  const courseResults = COURSES.map((course) => {
    const courseScores = scores.filter((s) => s.course_id === course.id);
    const useHandicap = course.id !== "whanganui";
    const aNet = teamNetTotal(teamA, courseScores, useHandicap);
    const bNet = teamNetTotal(teamB, courseScores, useHandicap);

    if (aNet === null || bNet === null) return { course, result: "pending" as const, aNet, bNet };
    if (aNet < bNet) { aPoints++; return { course, result: "A" as const, aNet, bNet }; }
    if (bNet < aNet) { bPoints++; return { course, result: "B" as const, aNet, bNet }; }
    aPoints += 0.5; bPoints += 0.5;
    return { course, result: "tie" as const, aNet, bNet };
  });

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-bold">🏆 Series Score</h3>
      </div>

      {/* Overall score */}
      <div className="grid grid-cols-3 border-b border-white/10">
        <div className="py-4 text-center">
          <div className="text-3xl font-bold" style={{ color: TEAMS[0].color }}>{aPoints}</div>
          <div className="text-xs font-bold mt-1" style={{ color: TEAMS[0].color }}>{TEAMS[0].emoji} {TEAMS[0].name}</div>
        </div>
        <div className="py-4 text-center flex items-center justify-center">
          <span className="text-white/30 text-lg font-bold">VS</span>
        </div>
        <div className="py-4 text-center">
          <div className="text-3xl font-bold" style={{ color: TEAMS[1].color }}>{bPoints}</div>
          <div className="text-xs font-bold mt-1" style={{ color: TEAMS[1].color }}>{TEAMS[1].emoji} {TEAMS[1].name}</div>
        </div>
      </div>

      {/* Per course */}
      <div className="divide-y divide-white/5">
        {courseResults.map(({ course, result, aNet, bNet }) => (
          <div key={course.id} className="px-4 py-3 flex items-center gap-3">
            <span className="text-lg">{course.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium">{course.name}</div>
              <div className="text-white/30 text-[10px]">{course.format}</div>
            </div>
            {result === "pending" ? (
              <span className="text-white/30 text-xs">Not played</span>
            ) : result === "tie" ? (
              <span className="px-2 py-1 rounded bg-white/10 text-white/60 text-xs font-bold">Tied</span>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40">{aNet} vs {bNet}</span>
                <span
                  className="px-2 py-1 rounded font-bold"
                  style={{
                    backgroundColor: `${result === "A" ? TEAMS[0].color : TEAMS[1].color}20`,
                    color: result === "A" ? TEAMS[0].color : TEAMS[1].color,
                  }}
                >
                  {result === "A" ? TEAMS[0].name : TEAMS[1].name} win
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
