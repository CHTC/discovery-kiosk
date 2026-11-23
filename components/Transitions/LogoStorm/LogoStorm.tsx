import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

import { BASE_PATH, BRAND } from "@/lib/kiosk";

import type { KioskTransition } from "../Transition.types";

/*
 * A hurricane of CHTC logos. Dozens of logos spiral in from off-screen,
 * whipping around the center over a spinning red-and-black vortex that blots
 * out the outgoing slide. At the eye of the storm (the halfway mark) the
 * slides swap, then the logos fling back out and the vortex clears to reveal
 * the incoming slide, which unwinds from a slight twist.
 *
 * Each logo is three nested boxes: an orbit (rotates about the center), an
 * arm (its distance from the center), and the logo itself (tumbling). Per-logo
 * values go in through CSS custom properties, so one set of keyframes serves
 * every logo.
 */

const DURATION_MS = 2000;
const LOGO_COUNT = 72;
/** viewBox aspect of the CHTC mark. */
const LOGO_ASPECT = 216 / 703.5;
const WHIP = "cubic-bezier(0.45, 0, 0.55, 1)";

/** Deterministic 0–1 pseudo-random, so the storm looks the same every build. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return x - Math.floor(x);
}

const LOGOS = Array.from({ length: LOGO_COUNT }, (_, i) => {
  const peakRadius = Math.sqrt(rand(i + 1)) * 1000;
  const width = Math.round(110 + rand(i + 101) * 220);
  return {
    key: i,
    width,
    height: Math.round(width * LOGO_ASPECT),
    /** Golden-angle start positions spread logos evenly around the circle. */
    startAngle: `${(i * 137.5) % 360}deg`,
    /** Logos nearer the eye spin faster, like a real vortex. */
    spin: `${Math.round(540 + (1 - peakRadius / 1000) * 540 + rand(i + 201) * 180)}deg`,
    outerRadius: `${Math.round(1250 + rand(i + 301) * 450)}px`,
    peakRadius: `${Math.round(peakRadius)}px`,
    tumble: `${Math.round((rand(i + 401) - 0.5) * 900)}deg`,
  };
});

const orbit = keyframes`
  from { transform: rotate(var(--start)); }
  to   { transform: rotate(calc(var(--start) + var(--spin))); }
`;

const arm = keyframes`
  0%   { transform: translateX(var(--outer)); opacity: 0; }
  20%  { opacity: 1; }
  50%  { transform: translateX(var(--peak)); }
  80%  { opacity: 1; }
  100% { transform: translateX(var(--outer)); opacity: 0; }
`;

const tumble = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(var(--tumble)); }
`;

const vortex = keyframes`
  0%   { opacity: 0; transform: rotate(0deg); }
  35%  { opacity: 1; }
  65%  { opacity: 1; }
  100% { opacity: 0; transform: rotate(600deg); }
`;

const suckIn = keyframes`
  from { transform: scale(1) rotate(0deg); filter: brightness(1); }
  to   { transform: scale(0.75) rotate(-14deg); filter: brightness(0.3); }
`;

const unwind = keyframes`
  0%, 49.99% { visibility: hidden; }
  50%  { visibility: visible; transform: scale(1.12) rotate(10deg); }
  100% { visibility: visible; transform: none; }
`;

function LogoStormOverlay() {
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Box
        sx={{
          position: "absolute",
          inset: "-50%",
          background: `
            radial-gradient(circle at 50% 50%, ${BRAND.black} 0 6%, transparent 22%),
            conic-gradient(from 0deg at 50% 50%,
              ${BRAND.black} 0deg, ${BRAND.darkRed} 40deg, ${BRAND.black} 90deg,
              ${BRAND.red} 150deg, ${BRAND.black} 200deg, ${BRAND.darkRed} 260deg,
              ${BRAND.black} 310deg, ${BRAND.red} 345deg, ${BRAND.black} 360deg)`,
          animation: `${vortex} ${DURATION_MS}ms linear both`,
        }}
      />
      {LOGOS.map((logo) => (
        <Box
          key={logo.key}
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            "--start": logo.startAngle,
            "--spin": logo.spin,
            animation: `${orbit} ${DURATION_MS}ms ${WHIP} both`,
          }}
        >
          <Box
            sx={{
              "--outer": logo.outerRadius,
              "--peak": logo.peakRadius,
              animation: `${arm} ${DURATION_MS}ms ${WHIP} both`,
            }}
          >
            <Box
              component="img"
              src={`${BASE_PATH}/logos/chtc-white.svg`}
              alt=""
              sx={{
                display: "block",
                width: logo.width,
                height: logo.height,
                ml: `${-logo.width / 2}px`,
                mt: `${-logo.height / 2}px`,
                "--tumble": logo.tumble,
                animation: `${tumble} ${DURATION_MS}ms linear both`,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

const logoStorm: KioskTransition = {
  name: "LogoStorm",
  durationMs: DURATION_MS,
  enter: { animation: `${unwind} ${DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) both` },
  exit: { animation: `${suckIn} ${DURATION_MS / 2}ms cubic-bezier(0.6, 0, 0.9, 0.4) both` },
  Overlay: LogoStormOverlay,
};

export default logoStorm;
