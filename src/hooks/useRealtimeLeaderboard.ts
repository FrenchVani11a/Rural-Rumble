"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Player, Score, LeaderboardEntry } from "@/lib/types";
import { buildLeaderboard } from "@/lib/scoring";

export function useRealtimeLeaderboard(courseId?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    let scoresQuery = supabase.from("scores").select("*");
    if (courseId) scoresQuery = scoresQuery.eq("course_id", courseId);

    const [playersRes, scoresRes] = await Promise.all([
      supabase.from("players").select("*").order("created_at"),
      scoresQuery,
    ]);

    const p: Player[] = playersRes.data ?? [];
    const s: Score[] = scoresRes.data ?? [];

    setPlayers(p);
    setScores(s);
    setLeaderboard(buildLeaderboard(p, s));
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel(`leaderboard-${courseId ?? "all"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  return { leaderboard, loading, refetch: fetchAll, players, scores };
}
