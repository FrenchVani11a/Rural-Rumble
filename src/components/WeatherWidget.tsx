"use client";

import { useAllCourseWeather } from "@/hooks/useWeather";
import { COURSES } from "@/lib/constants";

export function WeatherWidget() {
  const weatherMap = useAllCourseWeather();

  const hasAny = Object.keys(weatherMap).length > 0;
  if (!hasAny) return null;

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      {COURSES.map((course) => {
        const w = weatherMap[course.id];
        if (!w) return null;
        return (
          <div key={course.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs">
            <span>{course.emoji}</span>
            <span className="text-white/50">{course.name.split(" ")[0]}</span>
            <span className="text-white font-medium">{w.icon} {w.temperature}°C</span>
            <span className="text-white/40">💨{w.windSpeed}</span>
          </div>
        );
      })}
    </div>
  );
}
