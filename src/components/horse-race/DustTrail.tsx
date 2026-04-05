"use client";

interface DustTrailProps {
  intensity: number; // 0 to 1
}

export function DustTrail({ intensity }: DustTrailProps) {
  if (intensity < 0.05) return null;

  const count = Math.ceil(intensity * 8);

  return (
    <div className="absolute right-full top-1/2 -translate-y-1/2 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-green-300/40"
          style={{
            animation: `dust-drift 0.6s ease-out forwards`,
            animationDelay: `${i * 60}ms`,
            top: `${(i % 3 - 1) * 6}px`,
            right: `${i * 3}px`,
          }}
        />
      ))}
    </div>
  );
}
