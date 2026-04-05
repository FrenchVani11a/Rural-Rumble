"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Player, Score, LeaderboardEntry } from "@/lib/types";
import { buildLeaderboard } from "@/lib/scoring";

export function useRealtimeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [playersRes, scoresRes] = await Promise.all([
      supabase.from("players").select("*").order("created_at"),
      supabase.from("scores").select("*"),
    ]);

    const players: Player[] = playersRes.data ?? [];
    const scores: Score[] = scoresRes.data ?? [];

    setLeaderboard(buildLeaderboard(players, scores));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        () => fetchAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  return { leaderboard, loading, refetch: fetchAll };
}
