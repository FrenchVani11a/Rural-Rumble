export interface HoleInfo {
  hole: number;
  par: number;
  strokeIndex: number;
  yards: number;
}

export const HOLES: HoleInfo[] = [
  { hole: 1, par: 4, strokeIndex: 5, yards: 330 },
  { hole: 2, par: 3, strokeIndex: 12, yards: 170 },
  { hole: 3, par: 4, strokeIndex: 17, yards: 219 },
  { hole: 4, par: 3, strokeIndex: 18, yards: 117 },
  { hole: 5, par: 5, strokeIndex: 8, yards: 375 },
  { hole: 6, par: 3, strokeIndex: 14, yards: 136 },
  { hole: 7, par: 5, strokeIndex: 9, yards: 446 },
  { hole: 8, par: 4, strokeIndex: 1, yards: 368 },
  { hole: 9, par: 5, strokeIndex: 16, yards: 422 },
  { hole: 10, par: 4, strokeIndex: 13, yards: 291 },
  { hole: 11, par: 5, strokeIndex: 11, yards: 470 },
  { hole: 12, par: 3, strokeIndex: 4, yards: 173 },
  { hole: 13, par: 4, strokeIndex: 2, yards: 364 },
  { hole: 14, par: 3, strokeIndex: 10, yards: 170 },
  { hole: 15, par: 4, strokeIndex: 3, yards: 359 },
  { hole: 16, par: 5, strokeIndex: 6, yards: 444 },
  { hole: 17, par: 4, strokeIndex: 7, yards: 344 },
  { hole: 18, par: 3, strokeIndex: 15, yards: 135 },
];

export const FRONT_NINE = HOLES.slice(0, 9);
export const BACK_NINE = HOLES.slice(9);

export const COURSES = [
  {
    id: "waverley",
    number: 1,
    name: "Waverley Golf Course",
    url: "https://www.waverleygolf.co.nz",
    holes: 18,
    format: "2v2 Match Play — Both Balls, Handicap Adjusted",
    description:
      "Full 18-hole match play. Both players' balls count on every hole with handicap strokes applied.",
    emoji: "🏌️",
  },
  {
    id: "whanganui",
    number: 2,
    name: "Whanganui Golf Club",
    url: "https://www.wanganuigolfclub.co.nz",
    holes: 9,
    format: "9 Holes — Can Per Hole, Match Play Best Ball",
    description:
      "Off the stick match play. Each player must consume one can per hole. An extra can earns a mulligan.",
    emoji: "🍺",
  },
  {
    id: "rangatira",
    number: 3,
    name: "Rangatira Golf Course",
    url: "https://www.rangatiragolf.co.nz",
    holes: 18,
    format: "Ambrose 2v2",
    description:
      "Both players hit, pick the best shot, and play from there. Pure team golf.",
    emoji: "🤝",
  },
] as const;

export const COURSE = {
  id: "waverley",
  name: "Waverley Golf Course",
  par: 71,
  holes: 18,
  location: "Waverley",
  description: COURSES[0].description,
  frontNinePar: FRONT_NINE.reduce((sum, h) => sum + h.par, 0),
  backNinePar: BACK_NINE.reduce((sum, h) => sum + h.par, 0),
} as const;

export const TEAMS = [
  {
    id: "challengers",
    name: "The Challengers",
    players: ["Alex Beaven", "Walter Todd"],
    color: "#E63946",
    emoji: "⚔️",
  },
  {
    id: "defenders",
    name: "The Defenders",
    players: ["Simon Reeves", "Dinesh Fonseka"],
    color: "#457B9D",
    emoji: "🛡️",
  },
] as const;

export const PLAYER_COLORS = [
  "#E63946", // red
  "#457B9D", // steel blue
  "#2A9D8F", // teal
  "#E9C46A", // gold
  "#F4A261", // sandy orange
  "#264653", // dark teal
  "#A8DADC", // light blue
  "#6D6875", // purple grey
  "#B5838D", // dusty rose
  "#606C38", // olive
  "#DDA15E", // caramel
  "#BC6C25", // burnt sienna
  "#0077B6", // ocean blue
  "#90BE6D", // sage green
  "#F94144", // bright red
  "#43AA8B", // jade
] as const;
