"use client";

import { NavBar } from "@/components/NavBar";
import { COURSES } from "@/lib/constants";
import { useAllCourseWeather } from "@/hooks/useWeather";

export default function CourseMapPage() {
  const weatherMap = useAllCourseWeather();

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-2xl mx-auto">
        <h1
          className="text-2xl md:text-4xl mb-2 text-center"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          <span className="text-yellow-400">The</span>{" "}
          <span className="text-white">Courses</span>
        </h1>
        <p className="text-center text-white/40 text-sm mb-8">3 courses · 2 days · Rural NZ</p>

        <div className="flex flex-col gap-6">
          {COURSES.map((course, i) => {
            const w = weatherMap[course.id];
            return (
              <div key={course.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{course.name}</div>
                    <div className="text-yellow-400/70 text-xs">{course.format}</div>
                  </div>
                  <span className="text-2xl">{course.emoji}</span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/5">
                  <div className="bg-[#0d1f0d] px-4 py-3">
                    <div className="text-white/40 text-xs">Holes</div>
                    <div className="text-white font-bold">{course.holes}</div>
                  </div>
                  <div className="bg-[#0d1f0d] px-4 py-3">
                    <div className="text-white/40 text-xs">Day</div>
                    <div className="text-white font-bold">{i < 2 ? "Day 1" : "Day 2"}</div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-white/5">
                  <p className="text-white/50 text-sm leading-relaxed">{course.description}</p>
                </div>

                {w && (
                  <div className="px-5 pb-3 flex items-center gap-3 text-sm border-t border-white/5 pt-3">
                    <span className="text-lg">{w.icon}</span>
                    <span className="text-white font-medium">{w.temperature}°C</span>
                    <span className="text-white/40">{w.description}</span>
                    <span className="text-white/30 ml-auto">💨 {w.windSpeed} km/h</span>
                  </div>
                )}

                <div className="px-5 pb-4">
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
                  >
                    Visit course website ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
