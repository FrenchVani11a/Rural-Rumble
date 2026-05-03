"use client";

import { NavBar } from "@/components/NavBar";
import { ChatBoard } from "@/components/ChatBoard";

export default function ChatPage() {
  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-2xl mx-auto">
        <h1
          className="text-2xl md:text-4xl mb-6 text-center"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          <span className="text-yellow-400">Trash</span>{" "}
          <span className="text-white">Talk</span>
        </h1>
        <ChatBoard />
      </main>
    </>
  );
}
