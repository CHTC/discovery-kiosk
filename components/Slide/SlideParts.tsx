import { Box, Typography, type SxProps, type Theme } from "@mui/material";

import { BASE_PATH, BRAND } from "@/lib/kiosk";

/** White CHTC wordmark, sized for a 1080p canvas. */
export function ChtcLogo({ height = 64, sx }: { height?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="img"
      src={`${BASE_PATH}/logos/chtc-white-text.svg`}
      alt="Center for High Throughput Computing"
      sx={{ height, width: "auto", display: "block", ...sx }}
    />
  );
}

/** Small all-caps label with a red rule, e.g. `UPCOMING EVENT`. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
      <Box sx={{ width: 72, height: 8, bgcolor: BRAND.red }} />
      <Typography
        component="span"
        sx={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        {children}
      </Typography>
    </Box>
  );
}

/**
 * An image shown whole (never cropped) over a blurred, dimmed copy of itself,
 * so art of any shape — photos, logos, posters — fills its box gracefully.
 * Fills its nearest positioned ancestor; `inset` pads the sharp copy.
 */
export function FramedImage({ src, alt, inset = 0 }: { src: string; alt: string; inset?: number | string }) {
  return (
    <>
      <Box
        component="img"
        src={src}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          inset: -60,
          width: "calc(100% + 120px)",
          height: "calc(100% + 120px)",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.45)",
        }}
      />
      <Box sx={{ position: "absolute", inset }}>
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>
    </>
  );
}

/** Clamp text to `lines` lines with an ellipsis. */
export function clampLines(lines: number): SxProps<Theme> {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}
