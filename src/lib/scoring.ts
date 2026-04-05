import { Player, Score, HoleScore, LeaderboardEntry } from "./types";
import { HOLES, HoleInfo } from "./constants";

/**
 * How many strokes a player receives on a given hole.
 * Stroke index 1 = hardest hole, 18 = easiest.
 * HC 18 → 1 stroke per hole. HC 25 → 1 on all + extra on SI 1-7.
 */
export function getStrokesForHole(handicap: number, strokeIndex: number): number {
  const base = Math.floor(handicap / 18);
  const remainder = handicap % 18;
  return base + (remainder >= strokeIndex ? 1 : 0);
}

export function calculateHoleNet(
  gross: number,
  handicap: number,
  strokeIndex: number
): number {
  return gross - getStrokesForHole(handicap, strokeIndex);
}

export function calculateFromHoleScores(
  holeScores: HoleScore[],
  handicap: number
): { grossTotal: number; netTotal: number; holesPlayed: number; parPlayed: number } {
  let grossTotal = 0;
  let netTotal = 0;
  let parPlayed = 0;

  for (const hs of holeScores) {
    const holeInfo = HOLES[hs.hole - 1];
    grossTotal += hs.gross;
    netTotal += calculateHoleNet(hs.gross, handicap, holeInfo.strokeIndex);
    parPlayed += holeInfo.par;
  }

  return { grossTotal, netTotal, holesPlayed: holeScores.length, parPlayed };
}

export function getHoleScoreToPar(gross: number, par: number): number {
  return gross - par;
}

export function calculateNetScore(grossScore: number, handicap: number): number {
  return grossScore - handicap;
}

export function calculateRacePosition(
  playerNetScore: number,
  bestNet: number,
  worstNet: number
): number {
  if (bestNet === worstNet) return 90;
  const range = worstNet - bestNet;
  const distanceFromWorst = worstNet - playerNetScore;
  return 15 + (distanceFromWorst / range) * 75;
}

export function buildLeaderboard(
  players: Player[],
  scores: Score[]
): LeaderboardEntry[] {
  const scoreMap = new Map(scores.map((s) => [s.player_id, s]));

  const entries: LeaderboardEntry[] = players.map((player) => ({
    player,
    score: scoreMap.get(player.id) ?? null,
    rank: 0,
    racePosition: 0,
  }));

  const withScores = entries
    .filter((e) => e.score !== null)
    .sort((a, b) => a.score!.net_score - b.score!.net_score);

  const withoutScores = entries.filter((e) => e.score === null);

  withScores.forEach((entry, i) => {
    entry.rank = i + 1;
  });
  withoutScores.forEach((entry, i) => {
    entry.rank = withScores.length + i + 1;
  });

  if (withScores.length > 0) {
    const bestNet = withScores[0].score!.net_score;
    const worstNet = withScores[withScores.length - 1].score!.net_score;

    withScores.forEach((entry) => {
      entry.racePosition = calculateRacePosition(
        entry.score!.net_score,
        bestNet,
        worstNet
      );
    });
  }

  withoutScores.forEach((entry) => {
    entry.racePosition = 5;
  });

  return [...withScores, ...withoutScores];
}

// ─── Award Computations ─────────────────────────────────────

export interface AwardResult {
  playerName: string;
  value: string;
  detail: string;
}

function playerName(players: Player[], id: string): string {
  return players.find((p) => p.id === id)?.name ?? "Unknown";
}

function playerHandicap(players: Player[], id: string): number {
  return players.find((p) => p.id === id)?.handicap ?? 0;
}

/** The Hahei Horror — worst single hole (gross over par) */
export function computeHaheiHorror(players: Player[], scores: Score[]): AwardResult | null {
  let worst: { name: string; hole: number; gross: number; par: number; over: number } | null = null;

  for (const score of scores) {
    const name = playerName(players, score.player_id);
    for (const hs of score.hole_scores) {
      const par = HOLES[hs.hole - 1].par;
      const over = hs.gross - par;
      if (!worst || over > worst.over) {
        worst = { name, hole: hs.hole, gross: hs.gross, par, over };
      }
    }
  }

  if (!worst || worst.over <= 0) return null;
  return {
    playerName: worst.name,
    value: `+${worst.over}`,
    detail: `${worst.gross} on hole ${worst.hole} (par ${worst.par})`,
  };
}

/** Best Par 3 — lowest net total on par 3 holes */
export function computeBestPar3(players: Player[], scores: Score[]): AwardResult | null {
  const par3Holes = new Set(HOLES.filter((h) => h.par === 3).map((h) => h.hole));
  let best: { name: string; totalNet: number; count: number } | null = null;

  for (const score of scores) {
    const hc = playerHandicap(players, score.player_id);
    const par3Scores = score.hole_scores.filter((hs) => par3Holes.has(hs.hole));
    if (par3Scores.length < 2) continue;

    let totalNet = 0;
    for (const hs of par3Scores) {
      const hi = HOLES[hs.hole - 1];
      totalNet += calculateHoleNet(hs.gross, hc, hi.strokeIndex);
    }

    if (!best || totalNet < best.totalNet) {
      best = { name: playerName(players, score.player_id), totalNet, count: par3Scores.length };
    }
  }

  if (!best) return null;
  return {
    playerName: best.name,
    value: `Net ${best.totalNet}`,
    detail: `Across ${best.count} par 3s`,
  };
}

/** Back 9 Bandit — best net on holes 10-18 */
export function computeBack9Bandit(players: Player[], scores: Score[]): AwardResult | null {
  let best: { name: string; net: number; count: number } | null = null;

  for (const score of scores) {
    const hc = playerHandicap(players, score.player_id);
    const back9 = score.hole_scores.filter((hs) => hs.hole >= 10);
    if (back9.length < 3) continue;

    let net = 0;
    for (const hs of back9) {
      const hi = HOLES[hs.hole - 1];
      net += calculateHoleNet(hs.gross, hc, hi.strokeIndex);
    }

    if (!best || net < best.net) {
      best = { name: playerName(players, score.player_id), net, count: back9.length };
    }
  }

  if (!best) return null;
  return {
    playerName: best.name,
    value: `Net ${best.net}`,
    detail: `${best.count} back 9 holes`,
  };
}

/** Birdie King — most holes with net under par */
export function computeBirdieKing(players: Player[], scores: Score[]): AwardResult | null {
  let best: { name: string; count: number } | null = null;

  for (const score of scores) {
    const hc = playerHandicap(players, score.player_id);
    let count = 0;
    for (const hs of score.hole_scores) {
      const hi = HOLES[hs.hole - 1];
      if (calculateHoleNet(hs.gross, hc, hi.strokeIndex) < hi.par) count++;
    }

    if (count > 0 && (!best || count > best.count)) {
      best = { name: playerName(players, score.player_id), count };
    }
  }

  if (!best) return null;
  return {
    playerName: best.name,
    value: `${best.count}`,
    detail: `birdie${best.count !== 1 ? "s" : ""} or better`,
  };
}

/** Bogey Train — longest streak of consecutive bogey+ holes */
export function computeBogeyTrain(players: Player[], scores: Score[]): AwardResult | null {
  let worst: { name: string; streak: number; start: number; end: number } | null = null;

  for (const score of scores) {
    const hc = playerHandicap(players, score.player_id);
    const sorted = [...score.hole_scores].sort((a, b) => a.hole - b.hole);

    let streak = 0;
    let streakStart = 0;

    for (let i = 0; i < sorted.length; i++) {
      const hs = sorted[i];
      const hi = HOLES[hs.hole - 1];
      const net = calculateHoleNet(hs.gross, hc, hi.strokeIndex);
      const isConsecutive = i === 0 || sorted[i].hole === sorted[i - 1].hole + 1;

      if (net > hi.par && isConsecutive) {
        if (streak === 0) streakStart = hs.hole;
        streak++;
      } else if (net > hi.par) {
        streak = 1;
        streakStart = hs.hole;
      } else {
        streak = 0;
      }

      if (streak >= 2 && (!worst || streak > worst.streak)) {
        worst = {
          name: playerName(players, score.player_id),
          streak,
          start: streakStart,
          end: hs.hole,
        };
      }
    }
  }

  if (!worst) return null;
  return {
    playerName: worst.name,
    value: `${worst.streak} in a row`,
    detail: `Holes ${worst.start}-${worst.end}`,
  };
}

/** Steady Eddie — most holes with net equal to par */
export function computeSteadyEddie(players: Player[], scores: Score[]): AwardResult | null {
  let best: { name: string; count: number } | null = null;

  for (const score of scores) {
    const hc = playerHandicap(players, score.player_id);
    let count = 0;
    for (const hs of score.hole_scores) {
      const hi = HOLES[hs.hole - 1];
      if (calculateHoleNet(hs.gross, hc, hi.strokeIndex) === hi.par) count++;
    }

    if (count > 0 && (!best || count > best.count)) {
      best = { name: playerName(players, score.player_id), count };
    }
  }

  if (!best) return null;
  return {
    playerName: best.name,
    value: `${best.count}`,
    detail: `par${best.count !== 1 ? "s" : ""}`,
  };
}
