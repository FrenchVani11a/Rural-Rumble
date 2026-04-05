"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function ChatBoard() {
  const { messages, sendMessage } = useChat();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hahei-chat-name");
    if (saved) setName(saved);
  }, []);

  const handleSend = async () => {
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    localStorage.setItem("hahei-chat-name", name.trim());
    await sendMessage(name, text);
    setText("");
    setSending(false);
  };

  return (
    <section className="mt-10">
      <h2
        className="text-xl md:text-2xl mb-4 text-center"
        style={{ fontFamily: "var(--font-bungee)" }}
      >
        <span className="text-yellow-400">Trash</span>{" "}
        <span className="text-white">Talk</span>
      </h2>

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {/* Messages */}
        <div className="max-h-64 overflow-y-auto p-4 flex flex-col-reverse gap-3">
          {messages.length === 0 ? (
            <p className="text-white/30 text-center text-sm py-4">
              No trash talk yet. Be the first!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold shrink-0">
                  {msg.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-sm">
                      {msg.author_name}
                    </span>
                    <span className="text-white/30 text-xs">
                      {timeAgo(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-3 flex gap-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
          />
          <input
            type="text"
            placeholder="Talk some trash..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !name.trim() || !text.trim()}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-green-900 font-bold text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
