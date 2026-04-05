"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/lib/types";
import { PLAYER_COLORS } from "@/lib/constants";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) setPlayers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const addPlayer = async (name: string, handicap: number) => {
    const color = PLAYER_COLORS[players.length % PLAYER_COLORS.length];
    const { error } = await supabase
      .from("players")
      .insert({ name, handicap, avatar_color: color });

    if (!error) await fetchPlayers();
    return !error;
  };

  const updatePlayer = async (
    id: string,
    name: string,
    handicap: number
  ) => {
    const { error } = await supabase
      .from("players")
      .update({ name, handicap })
      .eq("id", id);

    if (!error) await fetchPlayers();
    return !error;
  };

  const deletePlayer = async (id: string) => {
    await supabase.from("scores").delete().eq("player_id", id);
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (!error) await fetchPlayers();
    return !error;
  };

  return { players, loading, addPlayer, updatePlayer, deletePlayer, refetch: fetchPlayers };
}
