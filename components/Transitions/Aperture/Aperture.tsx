import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

import { BRAND, STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/kiosk";

import type { KioskTransition } from "../Transition.types";

/*
 * The next slide opens out of the center of the screen inside an expanding
 * CHTC-red ring, while the outgoing slide shrinks back and dims. Ring and clip
 * share duration and easing so the ring always rides the reveal's edge.
 */

const DURATION_MS = 1500;
const EASING = "cubic-bezier(0.7, 0, 0.25, 1)";
const RING = 22;
/** Just past the distance from the center to a corner of the stage. */
const MAX_RADIUS = Math.ceil(Math.hypot(STAGE_WIDTH, STAGE_HEIGHT) / 2) + RING * 2;

const open = keyframes`
  from { clip-path: circle(0px at 50% 50%); }
  to   { clip-path: circle(${MAX_RADIUS}px at 50% 50%); }
`;

const ring = keyframes`
  from { width: ${RING * 2}px; height: ${RING * 2}px; }
  to   { width: ${(MAX_RADIUS + RING) * 2}px; height: ${(MAX_RADIUS + RING) * 2}px; }
`;

const recede = keyframes`
  from { transform: scale(1); filter: brightness(1); }
  to   { transform: scale(0.88); filter: brightness(0.35); }
`;

function ApertureOverlay() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: `${RING}px solid ${BRAND.red}`,
        boxShadow: `0 0 0 6px ${BRAND.black}, inset 0 0 0 4px ${BRAND.white}`,
        animation: `${ring} ${DURATION_MS}ms ${EASING} both`,
      }}
    />
  );
}

const aperture: KioskTransition = {
  name: "Aperture",
  durationMs: DURATION_MS,
  enter: { animation: `${open} ${DURATION_MS}ms ${EASING} both` },
  exit: { animation: `${recede} ${DURATION_MS}ms ${EASING} both` },
  Overlay: ApertureOverlay,
};

export default aperture;
