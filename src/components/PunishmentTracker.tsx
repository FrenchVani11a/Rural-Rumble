"use client";

import { Player } from "@/lib/types";
import { PUNISHMENTS } from "@/lib/constants";
import { usePunishments } from "@/hooks/usePunishments";

const REMOVE_PASSWORD = "nogimmies";

interface Props {
  players: Player[];
  courseId?: string;
}

export function PunishmentTracker({ players, courseId = "general" }: Props) {
  const { addPunishment, removePunishment, countByPlayer } = usePunishments();
  const counts = countByPlayer(players);

  if (players.length === 0) return null;

  const handleRemove = (playerId: string, punishmentId: string, playerName: string, count: number) => {
    if (count === 0) return;
    const pw = window.prompt(`Password required to remove a punishment from ${playerName}:`);
    if (pw === null) return;
    if (pw !== REMOVE_PASSWORD) {
      window.alert("Wrong password. Nice try. 🚫");
      return;
    }
    removePunishment(playerId, punishmentId);
  };

  return (
    <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-bold text-sm">⚠️ Punishment Tracker</h3>
      </div>

      {/* Totals row */}
      <div className="grid border-b border-white/10" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
        {counts.map(({ player, total }) => (
          <div key={player.id} className="py-3 text-center border-r border-white/5 last:border-r-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold mx-auto mb-1"
              style={{ backgroundColor: player.avatar_color }}
            >
              {player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div className="text-white text-sm font-bold">{total}</div>
            <div className="text-white/30 text-[10px]">{player.name.split(" ")[0]}</div>
          </div>
        ))}
      </div>

      {/* Per punishment */}
      {PUNISHMENTS.map((p) => (
        <div key={p.id} className="border-b border-white/5 last:border-b-0">
          <div className="px-4 py-2 flex items-center gap-2 border-b border-white/5">
            <span className="text-base">{p.emoji}</span>
            <span className="text-white/70 text-xs font-medium">{p.title}</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
            {counts.map(({ player, byType }) => {
              const count = byType[p.id] ?? 0;
              return (
                <div key={player.id} className="py-2 text-center border-r border-white/5 last:border-r-0">
                  <div className="text-white/60 text-sm font-bold mb-1">{count}</div>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleRemove(player.id, p.id, player.name.split(" ")[0], count)}
                      className="text-[10px] px-2 py-1 rounded bg-white/10 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => addPunishment(player.id, p.id, courseId)}
                      className="text-[10px] px-2 py-1 rounded bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70 transition-colors"
                    >
                      +1
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
