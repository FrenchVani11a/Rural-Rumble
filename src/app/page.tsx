"use client";

import Link from "next/link";
import { Trophy } from "@/components/Trophy";
import { NavBar } from "@/components/NavBar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Commissioner } from "@/components/Commissioner";
import { COURSE } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center px-4 py-8 md:py-16">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <Trophy size={140} />
          <h1
            className="text-4xl md:text-6xl mt-6 mb-3 tracking-wide"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            <span className="text-yellow-400">The Hahei</span>{" "}
            <span className="text-white">Classic</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-md">
            Battle for glory at Mercury Bay Golf Club
          </p>
          <div className="flex items-center gap-2 mt-3 text-white/40 text-sm">
            <span>⛳</span>
            <span>{COURSE.location}</span>
            <span>&middot;</span>
            <span>Par {COURSE.par}</span>
            <span>&middot;</span>
            <span>{COURSE.holes} holes</span>
          </div>
          <WeatherWidget />
        </div>

        {/* Action buttons */}
        <div className="grid gap-4 w-full max-w-md mb-16">
          <Link
            href="/leaderboard"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-900 font-bold text-lg shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-3xl">🏁</span>
            <div>
              <div>Live Leaderboard</div>
              <div className="text-green-800/70 text-sm font-medium">
                Watch the horse race!
              </div>
            </div>
          </Link>

          <Link
            href="/scores"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-3xl">📝</span>
            <div>
              <div>Enter Scores</div>
              <div className="text-white/50 text-sm font-medium">
                Add your round score
              </div>
            </div>
          </Link>

          <Link
            href="/players"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-3xl">⛳</span>
            <div>
              <div>Manage Players</div>
              <div className="text-white/50 text-sm font-medium">
                Add players & handicaps
              </div>
            </div>
          </Link>
        </div>

        {/* The Commissioner */}
        <div className="w-full max-w-md mb-8">
          <Commissioner />
        </div>

        {/* Course info */}
        <div className="w-full max-w-md">
          <div className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏌️</span>
              <h3 className="text-white font-bold text-lg">{COURSE.name}</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {COURSE.description}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
