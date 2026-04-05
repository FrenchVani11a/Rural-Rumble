import { Player, Score, LeaderboardEntry } from "./types";

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

  // Players with scores first, sorted by net_score ascending (lower is better)
  const withScores = entries
    .filter((e) => e.score !== null)
    .sort((a, b) => a.score!.net_score - b.score!.net_score);

  const withoutScores = entries.filter((e) => e.score === null);

  // Assign ranks
  withScores.forEach((entry, i) => {
    entry.rank = i + 1;
  });
  withoutScores.forEach((entry, i) => {
    entry.rank = withScores.length + i + 1;
  });

  // Calculate race positions
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

  // Players without scores sit at the start line
  withoutScores.forEach((entry) => {
    entry.racePosition = 5;
  });

  return [...withScores, ...withoutScores];
}
