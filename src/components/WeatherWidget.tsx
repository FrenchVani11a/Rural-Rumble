"use client";

import { useWeather } from "@/hooks/useWeather";

export function WeatherWidget() {
  const weather = useWeather();

  if (!weather) return null;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mt-4">
      <span className="text-lg">{weather.icon}</span>
      <span className="text-white font-medium">{weather.temperature}°C</span>
      <span className="text-white/40">|</span>
      <span className="text-white/60">{weather.description}</span>
      <span className="text-white/40">|</span>
      <span className="text-white/60">💨 {weather.windSpeed} km/h</span>
    </div>
  );
}
