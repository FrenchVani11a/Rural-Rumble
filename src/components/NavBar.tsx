"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/leaderboard", label: "Race", icon: "🏁" },
  { href: "/scores", label: "Scores", icon: "📝" },
  { href: "/players", label: "Players", icon: "⛳" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/photos", label: "Photos", icon: "📸" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1 bg-green-900/95 backdrop-blur-sm px-6 py-3 sticky top-0 z-50 border-b border-green-700">
        <Link
          href="/"
          className="font-display text-xl text-yellow-400 mr-8 tracking-wide"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          Rural Rumble
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden sticky top-0 z-50 bg-green-900/95 backdrop-blur-sm border-b border-green-700">
        <div className="flex gap-1 overflow-x-auto px-2 py-1.5 scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                pathname === item.href
                  ? "bg-yellow-400/20 text-yellow-400"
                  : "text-white/60 active:bg-white/10"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
