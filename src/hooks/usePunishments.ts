"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/lib/types";

export interface PunishmentLog {
  id: string;
  player_id: string;
  punishment_id: string;
  course_id: string;
  created_at: string;
}

export function usePunishments() {
  const [logs, setLogs] = useState<PunishmentLog[]>([]);

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from("punishments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLogs(data);
  }, []);

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel("punishments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "punishments" }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  const addPunishment = async (playerId: string, punishmentId: string, courseId = "general") => {
    await supabase.from("punishments").insert({ player_id: playerId, punishment_id: punishmentId, course_id: courseId });
    await fetch();
  };

  const countByPlayer = (players: Player[]) => {
    return players.map((p) => ({
      player: p,
      total: logs.filter((l) => l.player_id === p.id).length,
      byType: Object.fromEntries(
        ["ladies-tee", "three-putt", "gimmie"].map((id) => [
          id,
          logs.filter((l) => l.player_id === p.id && l.punishment_id === id).length,
        ])
      ),
    }));
  };

  return { logs, addPunishment, countByPlayer };
}
