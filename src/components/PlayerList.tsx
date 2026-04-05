"use client";

import { Player } from "@/lib/types";

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export function PlayerList({ players, onEdit, onDelete }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="text-4xl mb-3">⛳</p>
        <p>No players yet. Add your first player above!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 group"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: player.avatar_color }}
          >
            {player.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">{player.name}</div>
            <div className="text-white/50 text-sm">Handicap: {player.handicap}</div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(player)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove ${player.name}?`)) onDelete(player.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
