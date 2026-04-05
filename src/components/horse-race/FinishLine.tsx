"use client";

export function FinishLine() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-7 z-10 flex flex-col border-l-2 border-white/30">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="flex-1 flex">
          <div
            className={`w-3.5 ${
              i % 2 === 0 ? "bg-gray-900" : "bg-white"
            }`}
          />
          <div
            className={`w-3.5 ${
              i % 2 === 0 ? "bg-white" : "bg-gray-900"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
