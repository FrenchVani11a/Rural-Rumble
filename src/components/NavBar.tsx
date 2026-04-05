"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/leaderboard", label: "Race", icon: "🏁" },
  { href: "/players", label: "Players", icon: "⛳" },
  { href: "/scores", label: "Scores", icon: "📝" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1 bg-green-900/95 backdrop-blur-sm px-6 py-3 sticky top-0 z-50 border-b border-green-700">
        <Link href="/" className="font-display text-xl text-yellow-400 mr-8 tracking-wide">
          The Hahei Classic
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

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-green-900/95 backdrop-blur-sm border-t border-green-700 safe-area-bottom">
        <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                pathname === item.href
                  ? "text-yellow-400"
                  : "text-white/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
