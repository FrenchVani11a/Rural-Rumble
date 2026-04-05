"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { PlayerForm } from "@/components/PlayerForm";
import { PlayerList } from "@/components/PlayerList";
import { usePlayers } from "@/hooks/usePlayers";
import { Player } from "@/lib/types";

export default function PlayersPage() {
  const { players, loading, addPlayer, updatePlayer, deletePlayer } =
    usePlayers();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleSubmit = async (name: string, handicap: number) => {
    if (editingPlayer) {
      const ok = await updatePlayer(editingPlayer.id, name, handicap);
      if (ok) setEditingPlayer(null);
      return ok;
    }
    return addPlayer(name, handicap);
  };

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-2xl mx-auto">
        <h1
          className="text-2xl md:text-4xl mb-6 text-center"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          <span className="text-yellow-400">The</span>{" "}
          <span className="text-white">Players</span>
        </h1>

        <div className="mb-8">
          <PlayerForm
            onSubmit={handleSubmit}
            editingPlayer={editingPlayer}
            onCancel={
              editingPlayer ? () => setEditingPlayer(null) : undefined
            }
          />
        </div>

        {loading ? (
          <div className="text-center text-white/40 animate-pulse py-12">
            Loading players...
          </div>
        ) : (
          <PlayerList
            players={players}
            onEdit={setEditingPlayer}
            onDelete={deletePlayer}
          />
        )}

        <div className="mt-8 text-center text-white/30 text-sm">
          {players.length} player{players.length !== 1 ? "s" : ""} registered
        </div>
      </main>
    </>
  );
}
