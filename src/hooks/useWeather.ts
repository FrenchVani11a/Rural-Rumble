"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  icon: string;
  description: string;
}

const COURSE_LOCATIONS = [
  { id: "waverley", name: "Waverley", lat: -39.766, lon: 174.638 },
  { id: "whanganui", name: "Whanganui", lat: -39.930, lon: 175.047 },
  { id: "rangatira", name: "Rangatira", lat: -39.940, lon: 175.050 },
];

function weatherCodeToDisplay(code: number): { icon: string; description: string } {
  if (code === 0) return { icon: "☀️", description: "Clear" };
  if (code <= 3) return { icon: "⛅", description: "Partly cloudy" };
  if (code <= 48) return { icon: "🌫️", description: "Foggy" };
  if (code <= 55) return { icon: "🌦️", description: "Drizzle" };
  if (code <= 65) return { icon: "🌧️", description: "Rain" };
  if (code <= 77) return { icon: "❄️", description: "Snow" };
  if (code <= 82) return { icon: "🌧️", description: "Showers" };
  if (code <= 99) return { icon: "⛈️", description: "Thunderstorm" };
  return { icon: "🌤️", description: "Mixed" };
}

export function useWeather(courseId?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loc = courseId
      ? COURSE_LOCATIONS.find((l) => l.id === courseId) ?? COURSE_LOCATIONS[0]
      : COURSE_LOCATIONS[0];

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,wind_speed_10m,weather_code`
        );
        const data = await res.json();
        const { temperature_2m, wind_speed_10m, weather_code } = data.current;
        const display = weatherCodeToDisplay(weather_code);
        setWeather({ temperature: Math.round(temperature_2m), windSpeed: Math.round(wind_speed_10m), ...display });
      } catch { /* non-critical */ }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900_000);
    return () => clearInterval(interval);
  }, [courseId]);

  return weather;
}

export function useAllCourseWeather() {
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});

  useEffect(() => {
    const fetchAll = async () => {
      const results: Record<string, WeatherData> = {};
      await Promise.all(
        COURSE_LOCATIONS.map(async (loc) => {
          try {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,wind_speed_10m,weather_code`
            );
            const data = await res.json();
            const { temperature_2m, wind_speed_10m, weather_code } = data.current;
            const display = weatherCodeToDisplay(weather_code);
            results[loc.id] = { temperature: Math.round(temperature_2m), windSpeed: Math.round(wind_speed_10m), ...display };
          } catch { /* skip */ }
        })
      );
      setWeatherMap(results);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 900_000);
    return () => clearInterval(interval);
  }, []);

  return weatherMap;
}
