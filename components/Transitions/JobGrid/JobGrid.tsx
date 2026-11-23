import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

import { BRAND, STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/kiosk";

import type { KioskTransition } from "../Transition.types";

/*
 * High-throughput computing, visualized: a 16×9 grid of "jobs" fills the
 * screen in a diagonal cascade, then drains away in the same order to reveal
 * the next slide. The slides swap at the halfway mark, when every tile is up.
 *
 * Timing: each tile animates for 80% of the run, starting up to 20% late.
 * It is fully grown from 25% to 75% of its own run, so every tile is up from
 * 40% to 60% of the whole transition — the swap at 50% is always hidden.
 */

const DURATION_MS = 1800;
const COLS = 16;
const ROWS = 9;
const TILE_W = STAGE_WIDTH / COLS;
const TILE_H = STAGE_HEIGHT / ROWS;
const TILE_RUN_MS = DURATION_MS * 0.8;
const MAX_DELAY_MS = DURATION_MS * 0.2;

const tile = keyframes`
  0%   { transform: scale(0) rotate(-90deg); animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); }
  25%  { transform: scale(1) rotate(0deg); }
  75%  { transform: scale(1) rotate(0deg); animation-timing-function: cubic-bezier(0.8, 0, 0.8, 0.2); }
  100% { transform: scale(0) rotate(90deg); }
`;

/** Hidden for the first half, shown for the second. */
const swapIn = keyframes`
  0%, 49.99% { visibility: hidden; }
  50%, 100%  { visibility: visible; }
`;

/** Mostly CHTC red, with darker and black "jobs" scattered in a fixed pattern. */
function tileColor(row: number, col: number): string {
  // Integer hash, so the dark tiles scatter instead of lining up in stripes.
  const n = ((Math.imul(row + 1, 73_856_093) ^ Math.imul(col + 1, 19_349_663)) >>> 0) % 10;
  if (n < 6) return BRAND.red;
  if (n < 8) return BRAND.darkRed;
  return BRAND.black;
}

const TILES = Array.from({ length: ROWS * COLS }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  return {
    key: i,
    row,
    col,
    color: tileColor(row, col),
    delayMs: Math.round(((row + col) / (ROWS + COLS - 2)) * MAX_DELAY_MS),
  };
});

function JobGridOverlay() {
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {TILES.map((t) => (
        <Box
          key={t.key}
          sx={{
            position: "absolute",
            // One pixel of overlap hides seams when the stage is scaled.
            left: t.col * TILE_W - 0.5,
            top: t.row * TILE_H - 0.5,
            width: TILE_W + 1,
            height: TILE_H + 1,
            bgcolor: t.color,
            boxShadow: "inset 0 0 0 3px rgba(0, 0, 0, 0.18)",
            animation: `${tile} ${TILE_RUN_MS}ms ${t.delayMs}ms both`,
          }}
        />
      ))}
    </Box>
  );
}

const jobGrid: KioskTransition = {
  name: "JobGrid",
  durationMs: DURATION_MS,
  enter: { animation: `${swapIn} ${DURATION_MS}ms linear both` },
  exit: {},
  Overlay: JobGridOverlay,
};

export default jobGrid;
