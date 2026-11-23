import { Box, Typography } from "@mui/material";

import { BRAND, STAGE_WIDTH } from "@/lib/kiosk";

import type { ArticleSlideData } from "./Slide.types";
import { ChtcLogo, Eyebrow, clampLines } from "./SlideParts";

/**
 * Article card images are always 2:1, so at full stage width one is exactly
 * 1920×960: it fills the top of the slide uncropped, leaving a 120px black
 * strip below for the logo.
 */
const IMAGE_HEIGHT = STAGE_WIDTH / 2;

/**
 * Recent article: its 2:1 card image across the top, with the headline on a
 * solid dark panel over the lower left so it reads against any image.
 */
export default function ArticleSlide({ slide }: { slide: ArticleSlideData }) {
  const byline = [slide.author && `By ${slide.author}`, slide.dateLabel].filter(Boolean).join("  ·  ");

  return (
    <Box sx={{ position: "absolute", inset: 0, bgcolor: BRAND.black, color: BRAND.white, overflow: "hidden" }}>
      <Box
        component="img"
        src={slide.image.src}
        alt={slide.image.alt}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: STAGE_WIDTH,
          height: IMAGE_HEIGHT,
          // A no-op for true 2:1 art; trims the edges of anything slightly off.
          objectFit: "cover",
        }}
      />
      {/* Blend the bottom of the image into the black strip. */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: IMAGE_HEIGHT - 240,
          height: 240,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 80,
          bottom: 56,
          maxWidth: 1260,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          px: 6,
          py: 5,
          bgcolor: "rgba(0, 0, 0, 0.82)",
          backdropFilter: "blur(16px)",
          borderLeft: `12px solid ${BRAND.red}`,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Eyebrow>CHTC {slide.label}</Eyebrow>
        <Typography component="h2" sx={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, ...clampLines(3) }}>
          {slide.title}
        </Typography>
        {slide.excerpt && (
          <Typography component="p" sx={{ fontSize: 30, lineHeight: 1.4, ...clampLines(2) }}>
            {slide.excerpt}
          </Typography>
        )}
        <Typography component="p" sx={{ fontSize: 26, fontWeight: 600, color: "rgba(255, 255, 255, 0.8)" }}>
          {byline}
        </Typography>
      </Box>

      <ChtcLogo height={60} sx={{ position: "absolute", right: 80, bottom: 30 }} />
    </Box>
  );
}
