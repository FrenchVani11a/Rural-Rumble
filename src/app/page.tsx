"use client";

import Link from "next/link";
import { Trophy } from "@/components/Trophy";
import { NavBar } from "@/components/NavBar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Commissioner } from "@/components/Commissioner";
import { COURSES, TEAMS } from "@/lib/constants";

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
            <span className="text-yellow-400">Rural</span>{" "}
            <span className="text-white">Rumble</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-md">
            Three courses. Two teams. One trophy.
          </p>
          <div className="flex items-center gap-2 mt-3 text-white/40 text-sm">
            <span>⛳</span>
            <span>3 Courses</span>
            <span>&middot;</span>
            <span>4 Players</span>
            <span>&middot;</span>
            <span>All formats</span>
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

        {/* Teams */}
        <div className="w-full max-w-md mb-6">
          <h2 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">The Teams</h2>
          <div className="grid grid-cols-2 gap-3">
            {TEAMS.map((team) => (
              <div key={team.id} className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">{team.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{team.name}</div>
                {team.players.map((p) => (
                  <div key={p} className="text-white/50 text-xs">{p}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="w-full max-w-md">
          <h2 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">The Courses</h2>
          <div className="flex flex-col gap-3">
            {COURSES.map((course) => (
              <div key={course.id} className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{course.emoji}</span>
                  <div>
                    <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Course {course.number}</span>
                    <div className="text-white font-bold text-sm">{course.name}</div>
                  </div>
                </div>
                <div className="text-yellow-400/80 text-xs font-medium mb-1">{course.format}</div>
                <p className="text-white/40 text-xs leading-relaxed">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
