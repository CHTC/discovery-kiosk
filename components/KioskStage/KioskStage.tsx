"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

import { BRAND, STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/kiosk";

interface KioskStageProps {
  children: React.ReactNode;
}

/**
 * A fixed 1920×1080 canvas, centered and scaled to fit the window.
 *
 * Slides are laid out in real 1080p pixels, so they look exactly as designed
 * on the kiosk TV and still preview correctly in any browser window.
 */
export default function KioskStage({ children }: KioskStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const scale = Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
      if (stageRef.current) {
        stageRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <Box sx={{ position: "fixed", inset: 0, bgcolor: BRAND.black, overflow: "hidden", cursor: "none" }}>
      <Box
        ref={stageRef}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: "translate(-50%, -50%)",
          transformOrigin: "center",
          overflow: "hidden",
          bgcolor: BRAND.black,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
