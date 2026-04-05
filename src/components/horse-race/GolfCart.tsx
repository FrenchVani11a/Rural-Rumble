"use client";

interface GolfCartProps {
  color: string;
  initials: string;
  size?: number;
}

export function GolfCart({ color, initials, size = 56 }: GolfCartProps) {
  const h = size;
  const w = size * 1.5;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 84 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      {/* Cart body */}
      <rect x="8" y="12" width="56" height="28" rx="6" fill={color} />
      {/* Roof */}
      <path
        d="M18 12 L18 4 C18 2 20 0 22 0 L50 0 C52 0 54 2 54 4 L54 12"
        fill={color}
        opacity="0.8"
      />
      {/* Roof supports */}
      <rect x="18" y="0" width="3" height="12" fill={color} opacity="0.6" />
      <rect x="51" y="0" width="3" height="12" fill={color} opacity="0.6" />
      {/* Windshield */}
      <rect x="44" y="4" width="8" height="8" rx="1" fill="white" opacity="0.7" />
      {/* Player initials */}
      <text
        x="36"
        y="31"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {initials}
      </text>
      {/* Front wheel */}
      <circle cx="56" cy="44" r="8" fill="#333" />
      <circle cx="56" cy="44" r="4" fill="#666" />
      {/* Rear wheel */}
      <circle cx="20" cy="44" r="8" fill="#333" />
      <circle cx="20" cy="44" r="4" fill="#666" />
      {/* Flag on back */}
      <rect x="4" y="2" width="2" height="22" fill="#666" />
      <polygon points="6,2 6,12 16,7" fill={color} />
    </svg>
  );
}
