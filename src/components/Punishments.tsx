"use client";

import { useState } from "react";
import { PUNISHMENTS } from "@/lib/constants";

export function Punishments() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
        ⚠️ Punishments
      </h2>
      <div className="flex flex-col gap-2">
        {PUNISHMENTS.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpen(open === p.id ? null : p.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left"
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-white font-bold text-sm flex-1">{p.title}</span>
              <span className="text-white/30 text-lg">{open === p.id ? "▲" : "▼"}</span>
            </button>
            {open === p.id && (
              <div className="px-5 pb-4 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">
                {p.rule}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
