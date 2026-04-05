"use client";

export function FinishLine() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-6 z-10 flex flex-col">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 flex`}
        >
          <div
            className={`w-3 ${
              (Math.floor(i / 1) + 0) % 2 === 0 ? "bg-black" : "bg-white"
            }`}
          />
          <div
            className={`w-3 ${
              (Math.floor(i / 1) + 1) % 2 === 0 ? "bg-black" : "bg-white"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
