"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  icon: string;
  description: string;
}

function weatherCodeToDisplay(code: number): { icon: string; description: string } {
  if (code === 0) return { icon: "☀️", description: "Clear skies" };
  if (code <= 3) return { icon: "⛅", description: "Partly cloudy" };
  if (code <= 48) return { icon: "🌫️", description: "Foggy" };
  if (code <= 55) return { icon: "🌦️", description: "Drizzle" };
  if (code <= 65) return { icon: "🌧️", description: "Rain" };
  if (code <= 77) return { icon: "❄️", description: "Snow" };
  if (code <= 82) return { icon: "🌧️", description: "Showers" };
  if (code <= 99) return { icon: "⛈️", description: "Thunderstorm" };
  return { icon: "🌤️", description: "Mixed" };
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-36.83&longitude=175.70&current=temperature_2m,wind_speed_10m,weather_code"
        );
        const data = await res.json();
        const { temperature_2m, wind_speed_10m, weather_code } = data.current;
        const display = weatherCodeToDisplay(weather_code);
        setWeather({
          temperature: Math.round(temperature_2m),
          windSpeed: Math.round(wind_speed_10m),
          ...display,
        });
      } catch {
        // Silently fail — weather is non-critical
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900_000);
    return () => clearInterval(interval);
  }, []);

  return weather;
}
