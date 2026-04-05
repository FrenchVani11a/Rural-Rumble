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
