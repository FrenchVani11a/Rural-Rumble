"use client";

import { useState, useEffect } from "react";
import { Player } from "@/lib/types";

interface PlayerFormProps {
  onSubmit: (name: string, handicap: number) => Promise<boolean>;
  editingPlayer?: Player | null;
  onCancel?: () => void;
}

export function PlayerForm({ onSubmit, editingPlayer, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(editingPlayer?.name ?? "");
  const [handicap, setHandicap] = useState(editingPlayer?.handicap?.toString() ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(editingPlayer?.name ?? "");
    setHandicap(editingPlayer?.handicap?.toString() ?? "");
  }, [editingPlayer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handicap) return;

    setSubmitting(true);
    const success = await onSubmit(name.trim(), parseInt(handicap));
    if (success) {
      setName("");
      setHandicap("");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Player name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-base"
        required
      />
      <input
        type="number"
        placeholder="Handicap"
        value={handicap}
        onChange={(e) => setHandicap(e.target.value)}
        min="0"
        max="54"
        inputMode="numeric"
        className="w-full sm:w-28 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-base"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl bg-yellow-400 text-green-900 font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 text-base"
        >
          {editingPlayer ? "Update" : "Add Player"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-base"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
