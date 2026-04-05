export interface Player {
  id: string;
  name: string;
  handicap: number;
  avatar_color: string;
  created_at: string;
}

export interface HoleScore {
  hole: number;
  gross: number;
}

export interface Score {
  id: string;
  player_id: string;
  gross_score: number;
  net_score: number;
  hole_scores: HoleScore[];
  holes_played: number;
  par_played: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

export interface LeaderboardEntry {
  player: Player;
  score: Score | null;
  rank: number;
  racePosition: number;
}
