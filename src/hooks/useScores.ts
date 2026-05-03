"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Score, HoleScore } from "@/lib/types";
import { calculateFromHoleScores } from "@/lib/scoring";

export function useScores(courseId: string = "waverley") {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (!error && data) setScores(data);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const upsertScore = async (
    playerId: string,
    holeScores: HoleScore[],
    handicap: number
  ) => {
    const { grossTotal, netTotal, holesPlayed, parPlayed } = calculateFromHoleScores(
      holeScores,
      handicap
    );

    const { error } = await supabase.from("scores").upsert(
      {
        player_id: playerId,
        course_id: courseId,
        gross_score: grossTotal,
        net_score: netTotal,
        hole_scores: holeScores,
        holes_played: holesPlayed,
        par_played: parPlayed,
      },
      { onConflict: "player_id,course_id" }
    );

    if (!error) await fetchScores();
    return !error;
  };

  const resetScore = async (playerId: string) => {
    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("player_id", playerId)
      .eq("course_id", courseId);

    if (!error) await fetchScores();
    return !error;
  };

  return { scores, loading, upsertScore, resetScore, refetch: fetchScores };
}
