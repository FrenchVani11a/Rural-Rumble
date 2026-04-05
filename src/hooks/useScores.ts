"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Score } from "@/lib/types";
import { calculateNetScore } from "@/lib/scoring";

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) setScores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const upsertScore = async (
    playerId: string,
    grossScore: number,
    handicap: number
  ) => {
    const netScore = calculateNetScore(grossScore, handicap);

    const { error } = await supabase.from("scores").upsert(
      {
        player_id: playerId,
        gross_score: grossScore,
        net_score: netScore,
      },
      { onConflict: "player_id" }
    );

    if (!error) await fetchScores();
    return !error;
  };

  return { scores, loading, upsertScore, refetch: fetchScores };
}
