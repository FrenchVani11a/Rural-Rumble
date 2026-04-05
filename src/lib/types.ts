export interface Player {
  id: string;
  name: string;
  handicap: number;
  avatar_color: string;
  created_at: string;
}

export interface Score {
  id: string;
  player_id: string;
  gross_score: number;
  net_score: number;
  created_at: string;
}

export interface LeaderboardEntry {
  player: Player;
  score: Score | null;
  rank: number;
  racePosition: number;
}
