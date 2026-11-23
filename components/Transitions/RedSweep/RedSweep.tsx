import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

import { BRAND, STAGE_WIDTH } from "@/lib/kiosk";

import type { KioskTransition } from "../Transition.types";

/*
 * An angled CHTC-red panel sweeps left to right. The incoming slide is clipped
 * to the region behind the panel's trailing edge, so it's painted on in the
 * panel's wake. Panel and clip share duration and easing, which keeps them in
 * lock-step.
 */

const DURATION_MS = 1400;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const PANEL_WIDTH = 720;
/** Horizontal offset between the panel's top and bottom corners (its slant). */
const SLANT = 240;
/** How far inside the panel the reveal edge sits, so no seam shows. */
const INSET = 120;

const START = -(PANEL_WIDTH + SLANT);
const END = STAGE_WIDTH + SLANT;

const sweep = keyframes`
  from { transform: translateX(${START}px); }
  to   { transform: translateX(${END}px); }
`;

const reveal = keyframes`
  from { clip-path: polygon(-2000px 0, ${START + SLANT + INSET}px 0, ${START + INSET}px 100%, -2000px 100%); }
  to   { clip-path: polygon(-2000px 0, ${END + SLANT + INSET}px 0, ${END + INSET}px 100%, -2000px 100%); }
`;

const drift = keyframes`
  from { transform: translateX(0); filter: brightness(1); }
  to   { transform: translateX(-120px); filter: brightness(0.5); }
`;

function RedSweepOverlay() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: PANEL_WIDTH,
        clipPath: `polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%)`,
        background: `linear-gradient(90deg, ${BRAND.darkRed} 0 14%, ${BRAND.red} 14% 82%, ${BRAND.black} 82% 100%)`,
        animation: `${sweep} ${DURATION_MS}ms ${EASING} both`,
        willChange: "transform",
      }}
    />
  );
}

const redSweep: KioskTransition = {
  name: "RedSweep",
  durationMs: DURATION_MS,
  enter: { animation: `${reveal} ${DURATION_MS}ms ${EASING} both` },
  exit: { animation: `${drift} ${DURATION_MS}ms ${EASING} both` },
  Overlay: RedSweepOverlay,
};

export default redSweep;
