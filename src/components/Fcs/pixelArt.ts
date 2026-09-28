/**
 * 8-bit illustrations for the FCS page, in the style of the FCS / Frankencoin pixel logos.
 * Icons are 16x16 grids of palette letters; render at multiples of 16px so every cell lands on whole pixels.
 * Ported from the FCS landing page prototype (components/v3/PixelArt.tsx).
 */

export const PALETTE: Record<string, string> = {
  D: "#092f62", // Deep Blue
  S: "#0f80f0", // Swiss Blue
  L: "#c3dffb", // Swiss Blue 25% tint
  W: "#ffffff",
  R: "#da291c", // Swiss flag red
};

export interface Cell {
  x: number;
  y: number;
  fill: string;
}

export function cellsFromRows(rows: string[]): Cell[] {
  const cells: Cell[] = [];
  rows.forEach((row, y) => [...row].forEach((ch, x) => PALETTE[ch] && cells.push({ x, y, fill: PALETTE[ch] })));
  return cells;
}

/** A pixel pie: the pool, with one quarter lifted out in Swiss Blue (your share). Generated, so it stays symmetric. */
function pieRows(): string[] {
  const grid = Array.from({ length: 16 }, () => Array<string>(16).fill("."));
  const cx = 7.5;
  const cy = 8.5;
  const r = 6.6;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      if (dx > 0 && dy < 0) {
        // exploded slice: shifted one cell up and right
        const tx = x + 1;
        const ty = y - 1;
        if (tx < 16 && ty >= 0) grid[ty][tx] = d > r - 1 ? "D" : "S";
      } else {
        grid[y][x] = d > r - 1 ? "D" : "L";
      }
    }
  }
  return grid.map((row) => row.join(""));
}

const BALLOT = [
  "....DDDDDDDD....",
  "....DWWWWWWD....",
  "....DWWWWWSD....",
  "....DWWWWSSD....",
  "....DSWWSSWD....",
  "....DSSSSWWD....",
  "....DWSSWWWD....",
  "..SSDDDDDDDDSS..",
  "..SSSSSSSSSSSS..",
  "..DDDDDDDDDDDD..",
  "..DLLLLLLLLLLD..",
  "..DLLLLLLLLLLD..",
  "..DLLLSSSSLLLD..",
  "..DLLLLLLLLLLD..",
  "..DLLLLLLLLLLD..",
  "..DDDDDDDDDDDD..",
];

const COINS = [
  "................",
  "......DDDD......",
  ".....DSSSSD.....",
  ".....DSWSSD.....",
  ".....DSSSSD.....",
  "......DDDD......",
  "................",
  "....DDDDDDDD....",
  "...DLLLLLLLLD...",
  "...DDDDDDDDDD...",
  "...DLLLLLLLLD...",
  "...DDDDDDDDDD...",
  "...DLLLLLLLLD...",
  "...DDDDDDDDDD...",
  "...DLLLLLLLLD...",
  "....DDDDDDDD....",
];

const LOCK = [
  "................",
  "......DDDD......",
  ".....D....D.....",
  "....D......D....",
  "....D......D....",
  "....D......D....",
  "..DDDDDDDDDDDD..",
  "..DSSSSSSSSSSD..",
  "..DSSSSSSSSSSD..",
  "..DSSSSDDSSSSD..",
  "..DSSSSDDSSSSD..",
  "..DSSSSSDSSSSD..",
  "..DSSSSSSSSSSD..",
  "..DSSSSSSSSSSD..",
  "..DDDDDDDDDDDD..",
  "................",
];

const BARS = [
  "................",
  "............DDD.",
  "............DSD.",
  "............DSD.",
  "........DDD.DSD.",
  "........DSD.DSD.",
  "........DSD.DSD.",
  "....DDD.DSD.DSD.",
  "....DLD.DSD.DSD.",
  "....DLD.DSD.DSD.",
  "....DLD.DSD.DSD.",
  "DDD.DLD.DSD.DSD.",
  "DLD.DLD.DSD.DSD.",
  "DLD.DLD.DSD.DSD.",
  "DDDDDDDDDDDDDDDD",
  "................",
];

const SHIELD = [
  "................",
  "..DDDDDDDDDDDD..",
  "..DSSSSSSSSSSD..",
  "..DSWSSSSSSWSD..",
  "..DSSWSSSSWSSD..",
  "..DSSSWSSWSSSD..",
  "..DSSSSWWSSSSD..",
  "..DSSSSWWSSSSD..",
  "..DSSSWSSWSSSD..",
  "..DSSWSSSSWSSD..",
  "..DSWSSSSSSWSD..",
  "...DSSSSSSSSD...",
  "....DSSSSSSD....",
  ".....DSSSSD.....",
  "......DDDD......",
  "................",
];

export const ICONS = {
  pie: { rows: pieRows(), title: "A pie with one slice lifted out: your share of the pool" },
  ballot: { rows: BALLOT, title: "A ballot with a tick going into a ballot box" },
  coins: { rows: COINS, title: "A coin dropping onto a stack" },
  lock: { rows: LOCK, title: "A closed padlock" },
  bars: { rows: BARS, title: "Rising bars" },
  shield: { rows: SHIELD, title: "A shield with an X" },
} as const;

export type IconName = keyof typeof ICONS;

/**
 * The Swiss flag in the style of the ZCHF pixel coin: a 32-cell grid, stepped pixel corners, and a light
 * diagonal shading that changes in visible pixel steps. Official proportions: cross arms 6 wide and 20 long,
 * 6 from the edge, so the cross is exactly centered (cells 13-18 and 6-25).
 */
export function swissFlagCells(): (Cell & { delay: number })[] {
  const STEPS = 8;
  const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  const RED = [[232, 58, 44], [196, 31, 20]]; // light top-left -> deep bottom-right, around #da291c
  const WHITE = [[255, 255, 255], [228, 231, 238]];
  const CORNER = [3, 2, 1]; // cells cut from each corner row
  const cells: (Cell & { delay: number })[] = [];
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const edgeY = Math.min(y, 31 - y);
      const edgeX = Math.min(x, 31 - x);
      if (edgeY < CORNER.length && edgeX < CORNER[edgeY]) continue;
      const white = (x >= 13 && x < 19 && y >= 6 && y < 26) || (y >= 13 && y < 19 && x >= 6 && x < 26);
      const t = Math.floor(((x + y) / 62) * STEPS) / (STEPS - 1);
      cells.push({ x, y, fill: white ? mix(WHITE[0], WHITE[1], t) : mix(RED[0], RED[1], t), delay: (x + y) * 14 });
    }
  }
  return cells;
}
