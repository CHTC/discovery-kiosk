import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

import { BASE_PATH, BRAND } from "@/lib/kiosk";

import type { KioskTransition } from "../Transition.types";

/*
 * One CHTC logo spins about its vertical middle axis, like a flipped coin,
 * growing from a speck to fill the screen and then shrinking away again. A
 * dark red glow rises behind it to cover the swap at its biggest, then fades
 * to reveal the incoming slide.
 */

const DURATION_MS = 1800;
const LOGO_WIDTH = 1000;
/** viewBox aspect of the CHTC mark. */
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 216) / 703.5);

const spin = keyframes`
  0%   { transform: scale(0.04) rotateY(0deg) rotateZ(-12deg); opacity: 0;
         animation-timing-function: cubic-bezier(0.3, 0, 0.6, 1); }
  12%  { opacity: 1; }
  50%  { transform: scale(1.7) rotateY(720deg) rotateZ(0deg);
         animation-timing-function: cubic-bezier(0.4, 0, 0.7, 1); }
  88%  { opacity: 1; }
  100% { transform: scale(0.04) rotateY(1440deg) rotateZ(12deg); opacity: 0; }
`;

const glow = keyframes`
  0%   { opacity: 0; }
  35%  { opacity: 1; }
  60%  { opacity: 1; }
  100% { opacity: 0; }
`;

const fallBack = keyframes`
  from { transform: scale(1); filter: brightness(1); }
  to   { transform: scale(0.92); filter: brightness(0.35); }
`;

const settle = keyframes`
  0%, 49.99% { visibility: hidden; }
  50%  { visibility: visible; transform: scale(0.94); }
  100% { visibility: visible; transform: none; }
`;

function LogoSpinOverlay() {
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${BRAND.darkRed} 0%, #2A0708 40%, ${BRAND.black} 75%)`,
          animation: `${glow} ${DURATION_MS}ms ease-in-out both`,
        }}
      />
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", perspective: "1800px" }}>
        <Box
          component="img"
          src={`${BASE_PATH}/logos/chtc-white.svg`}
          alt=""
          sx={{
            width: LOGO_WIDTH,
            height: LOGO_HEIGHT,
            filter: `drop-shadow(0 0 40px ${BRAND.red})`,
            animation: `${spin} ${DURATION_MS}ms both`,
          }}
        />
      </Box>
    </Box>
  );
}

const logoSpin: KioskTransition = {
  name: "LogoSpin",
  durationMs: DURATION_MS,
  enter: { animation: `${settle} ${DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) both` },
  exit: { animation: `${fallBack} ${DURATION_MS / 2}ms ease-in both` },
  Overlay: LogoSpinOverlay,
};

export default logoSpin;
