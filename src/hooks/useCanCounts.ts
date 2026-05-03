"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface CanCount {
  id: string;
  player_id: string;
  hole: number;
  count: number;
}

export function useCanCounts() {
  const [canCounts, setCanCounts] = useState<CanCount[]>([]);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("can_counts").select("*");
    if (data) setCanCounts(data);
  }, []);

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel("can-counts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "can_counts" }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  const setCount = async (playerId: string, hole: number, count: number) => {
    await supabase.from("can_counts").upsert(
      { player_id: playerId, hole, count, updated_at: new Date().toISOString() },
      { onConflict: "player_id,hole" }
    );
    await fetch();
  };

  const totalForPlayer = (playerId: string) =>
    canCounts.filter((c) => c.player_id === playerId).reduce((s, c) => s + c.count, 0);

  const countsForPlayer = (playerId: string) =>
    canCounts.filter((c) => c.player_id === playerId);

  return { canCounts, setCount, totalForPlayer, countsForPlayer };
}
