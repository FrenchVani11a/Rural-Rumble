import { HoleInfo } from "./constants";
import { Player } from "./types";

export interface PlayerHoleResult {
  player: Player;
  gross: number;
  toPar: number;
  label: string;
}

export interface HoleCommentary {
  nickname: string;
  subtitle: string;
  emoji: string;
}

export interface HoleFeature {
  description: string;
  terrain: string; // emoji terrain strip
  tags: string[]; // e.g. ["dogleg-left", "creek", "OB"]
}

// Actual course features from mercurybaygolf.co.nz
export const HOLE_FEATURES: Record<number, HoleFeature> = {
  1: {
    description: "Slight dogleg left. Totara trees 70m from green.",
    terrain: "🌲 ↰ ·····⛳ 🌲🌲",
    tags: ["dogleg-left", "trees"],
  },
  2: {
    description: "Tricky par 3. Small green protected by swales.",
    terrain: "〰️ ⛳ 〰️",
    tags: ["swales", "small-green"],
  },
  3: {
    description: "Short par 4 — eagle chance! OB & bunkers behind green.",
    terrain: "🚧 ·····⛳ ⛱️⛱️",
    tags: ["OB", "bunkers", "eagle-chance"],
  },
  4: {
    description: "Difficult par 3. OB left, right, AND long.",
    terrain: "🚧 ⛳ 🚧",
    tags: ["OB-three-sides"],
  },
  5: {
    description: "Double dogleg left. Native bush OB. Golden Totara.",
    terrain: "🌿 ↰ ··↰·· 🌳⛳",
    tags: ["double-dogleg", "native-bush", "OB"],
  },
  6: {
    description: "Most picturesque hole. Elevated tee to large green.",
    terrain: "⛰️ ~~~~~~~~ ⛳",
    tags: ["elevated-tee", "scenic", "OB-left"],
  },
  7: {
    description: "Reachable par 5. Creek runs entire left side.",
    terrain: "💧💧💧·····⛳ 🌲🌲",
    tags: ["creek-left", "trees-right", "reachable"],
  },
  8: {
    description: "HARDEST HOLE. Trees force shape off tee. Elevated green.",
    terrain: "🌲 ↰ 🌲🌲 ⛳⛰️",
    tags: ["hardest", "trees", "elevated-green"],
  },
  9: {
    description: "Front 9 finisher. Small green, plenty of breaks.",
    terrain: "·········⛳",
    tags: ["small-green"],
  },
  10: {
    description: "Short par 4. Risk/reward over Kanuka. OB right.",
    terrain: "🌿🌿 ⛳ 🚧",
    tags: ["risk-reward", "kanuka", "OB-right"],
  },
  11: {
    description: "Longest hole on course (470m). OB entire right side.",
    terrain: "···············⛳ 🚧",
    tags: ["longest", "OB-right"],
  },
  12: {
    description: "Many say the hardest. OB both sides. Sand trap fronting green.",
    terrain: "🚧 ⛱️⛳ 🚧",
    tags: ["OB-both-sides", "bunker-front"],
  },
  13: {
    description: "Dogleg right. OB right, lateral hazard left.",
    terrain: "💧 ···↱ ⛳ 🚧",
    tags: ["dogleg-right", "OB-right", "hazard-left"],
  },
  14: {
    description: "Beautiful amphitheatre of native Kahikatea bush.",
    terrain: "🌿🌲 ⛳ 🌲🌿",
    tags: ["amphitheatre", "native-bush", "scenic"],
  },
  15: {
    description: "Strong par 4. Creek right. Tree grove on plateau by green.",
    terrain: "·····💧 🌲🌲⛳",
    tags: ["creek-right", "trees"],
  },
  16: {
    description: "Creek crossing on 2nd shot. Lateral hazard left.",
    terrain: "💧 ···💧💧··· ⛳",
    tags: ["creek-crossing", "hazard-left"],
  },
  17: {
    description: "Creek fronting tee. Tree-lined fairway both sides.",
    terrain: "🌲💧💧🌲·····🌲⛳🌲",
    tags: ["creek-front", "tree-lined"],
  },
  18: {
    description: "Ridge splits green in two. Creek & flax behind.",
    terrain: "····⛳〰️💧🌿",
    tags: ["ridge-green", "creek-behind", "flax"],
  },
};

function getScoreLabel(toPar: number): string {
  if (toPar <= -3) return "Albatross";
  if (toPar === -2) return "Eagle";
  if (toPar === -1) return "Birdie";
  if (toPar === 0) return "Par";
  if (toPar === 1) return "Bogey";
  if (toPar === 2) return "Double";
  if (toPar === 3) return "Triple";
  return `+${toPar}`;
}

function getScoreEmoji(toPar: number): string {
  if (toPar <= -2) return "🦅";
  if (toPar === -1) return "🐦";
  if (toPar === 0) return "👍";
  if (toPar === 1) return "😬";
  if (toPar === 2) return "💩";
  return "💀";
}

export function buildPlayerHoleResults(
  hole: HoleInfo,
  players: Player[],
  scoreMap: Map<string, { hole: number; gross: number }[]>
): PlayerHoleResult[] {
  const results: PlayerHoleResult[] = [];

  for (const player of players) {
    const holeScores = scoreMap.get(player.id);
    if (!holeScores) continue;
    const hs = holeScores.find((s) => s.hole === hole.hole);
    if (!hs) continue;

    const toPar = hs.gross - hole.par;
    results.push({
      player,
      gross: hs.gross,
      toPar,
      label: getScoreLabel(toPar),
    });
  }

  // Sort best to worst
  results.sort((a, b) => a.toPar - b.toPar);
  return results;
}

export function generateHoleCommentary(
  hole: HoleInfo,
  results: PlayerHoleResult[]
): HoleCommentary {
  if (results.length === 0) {
    return {
      nickname: "Uncharted Territory",
      subtitle: "No one has dared attempt this hole yet",
      emoji: "🗺️",
    };
  }

  // Check for hole-in-one (par 3, gross === 1)
  const acePlayer = hole.par === 3 ? results.find((r) => r.gross === 1) : null;
  if (acePlayer) {
    return {
      nickname: `${acePlayer.player.name}'s Miracle`,
      subtitle: "HOLE IN ONE! Buy the drinks!",
      emoji: "🤯",
    };
  }

  // Check for eagle or better
  const eaglePlayer = results.find((r) => r.toPar <= -2);
  if (eaglePlayer) {
    return {
      nickname: `${eaglePlayer.player.name}'s Masterclass`,
      subtitle: `Pure wizardry on hole ${hole.hole}`,
      emoji: "🦅",
    };
  }

  const allBogeyOrWorse = results.every((r) => r.toPar > 0);
  if (allBogeyOrWorse) {
    const options: HoleCommentary[] = [
      { nickname: "The Graveyard", subtitle: "Nobody survived", emoji: "💀" },
      {
        nickname: `Massacre at the ${hole.hole}${getOrdinalSuffix(hole.hole)}`,
        subtitle: "Carnage everywhere",
        emoji: "🩸",
      },
      {
        nickname: "The Bermuda Triangle",
        subtitle: "Scores disappeared here",
        emoji: "🔺",
      },
    ];
    return options[hole.hole % options.length];
  }

  // One player dominates (2+ better than average)
  if (results.length >= 2) {
    const best = results[0];
    const avgToPar =
      results.slice(1).reduce((sum, r) => sum + r.toPar, 0) /
      (results.length - 1);
    if (best.toPar <= avgToPar - 2) {
      return {
        nickname: `${best.player.name}'s Show`,
        subtitle: "Left everyone in the dust",
        emoji: "🏆",
      };
    }
  }

  // Everyone made par
  const allPar = results.every((r) => r.toPar === 0);
  if (allPar) {
    return {
      nickname: "Snooze Fest",
      subtitle: "Everyone played it safe",
      emoji: "😴",
    };
  }

  // Big spread (best vs worst >= 4)
  const best = results[0].toPar;
  const worst = results[results.length - 1].toPar;
  if (worst - best >= 4) {
    return {
      nickname: "Tale of Two Golfers",
      subtitle: `From hero to zero in ${hole.yards}m`,
      emoji: "📖",
    };
  }

  // Special: hardest hole (SI 1 = hole 8)
  if (hole.strokeIndex === 1) {
    const anyParOrBetter = results.some((r) => r.toPar <= 0);
    return anyParOrBetter
      ? { nickname: "Beast Tamed", subtitle: "Someone conquered the hardest hole", emoji: "💪" }
      : { nickname: "The Beast Strikes", subtitle: "The hardest hole lived up to its name", emoji: "⚠️" };
  }

  // Special: hole 18
  if (hole.hole === 18) {
    const avgToPar = results.reduce((s, r) => s + r.toPar, 0) / results.length;
    return avgToPar <= 0
      ? { nickname: "Grand Finale", subtitle: "Finished with a flourish", emoji: "🎬" }
      : { nickname: "The Final Act", subtitle: "The course had the last laugh", emoji: "🎭" };
  }

  // Default pool based on hole characteristics
  return getDefaultCommentary(hole, results);
}

function getDefaultCommentary(
  hole: HoleInfo,
  results: PlayerHoleResult[]
): HoleCommentary {
  const avgToPar = results.reduce((s, r) => s + r.toPar, 0) / results.length;
  const hasBirdies = results.some((r) => r.toPar < 0);

  if (hole.par === 5) {
    if (avgToPar < 0) return { nickname: "Birdie Highway", subtitle: "The par 5 gave up the goods", emoji: "🛣️" };
    if (avgToPar > 1) return { nickname: "The Long Slog", subtitle: "All those metres for nothing", emoji: "🥾" };
    return { nickname: "The Long Walk", subtitle: "A fair fight with the par 5", emoji: "🚶" };
  }

  if (hole.par === 3 && hole.yards < 140) {
    if (hasBirdies) return { nickname: "Short & Sweet", subtitle: "Someone took advantage", emoji: "🍬" };
    if (avgToPar > 1) return { nickname: "Short but Deadly", subtitle: "Distance means nothing here", emoji: "🐍" };
    return { nickname: "Target Practice", subtitle: "Hit the green, make the putt", emoji: "🎯" };
  }

  if (hole.par === 3) {
    if (hasBirdies) return { nickname: "Dart Board", subtitle: "Someone hit the bullseye", emoji: "🎯" };
    if (avgToPar > 1) return { nickname: "The Humbler", subtitle: "Looks easy, plays hard", emoji: "🪤" };
    return { nickname: "Iron Test", subtitle: "A solid par 3 challenge", emoji: "🏌️" };
  }

  // Par 4s
  if (hole.yards < 250) {
    if (hasBirdies) return { nickname: "Birdie Bait", subtitle: "Short enough to attack", emoji: "🐦" };
    return { nickname: "The Teaser", subtitle: "Short but it bites back", emoji: "😏" };
  }

  if (hole.strokeIndex <= 5) {
    if (avgToPar > 0.5) return { nickname: "The Gauntlet", subtitle: "High stroke index, higher scores", emoji: "⚔️" };
    return { nickname: "Respect Earned", subtitle: "Tough hole, handled well", emoji: "🤝" };
  }

  const pool: HoleCommentary[] = [
    { nickname: "Fairway to Heaven", subtitle: "A walk in the park... kinda", emoji: "☁️" },
    { nickname: "Middle of the Road", subtitle: "Nothing to write home about", emoji: "🛤️" },
    { nickname: "Bread and Butter", subtitle: "Keep it simple, keep it straight", emoji: "🍞" },
    { nickname: "Steady as She Goes", subtitle: "No drama, just golf", emoji: "⛵" },
    { nickname: "The Daily Grind", subtitle: "Another day at the office", emoji: "☕" },
  ];
  return pool[hole.hole % pool.length];
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function getScoreColor(toPar: number): string {
  if (toPar <= -2) return "bg-yellow-400/20 text-yellow-300 border-yellow-400/30";
  if (toPar === -1) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (toPar === 0) return "bg-white/10 text-white/60 border-white/10";
  if (toPar === 1) return "bg-red-400/20 text-red-300 border-red-400/30";
  return "bg-red-600/30 text-red-200 border-red-600/30";
}

export function getScoreReactionEmoji(toPar: number): string {
  return getScoreEmoji(toPar);
}
