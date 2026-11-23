import { Box, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { BRAND } from "@/lib/kiosk";

import type { EventSlideData } from "./Slide.types";
import { ChtcLogo, Eyebrow, clampLines } from "./SlideParts";

/** Height of the art band across the top of the slide. */
const ART_HEIGHT = 600;

/**
 * Upcoming event: a full-width band of event art over the details.
 *
 * Event art is card art — usually wide, sometimes a square logo — so it is
 * shown whole on white, the way event cards show it on the website. Events
 * without art get a red band with the CHTC mark instead.
 */
export default function EventSlide({ slide }: { slide: EventSlideData }) {
  return (
    <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", bgcolor: BRAND.black, color: BRAND.white }}>
      <Box
        sx={{
          position: "relative",
          height: ART_HEIGHT,
          flexShrink: 0,
          bgcolor: slide.image ? BRAND.white : BRAND.red,
          overflow: "hidden",
        }}
      >
        {slide.image ? (
          <Box
            component="img"
            src={slide.image.src}
            alt={slide.image.alt}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <ChtcLogo height={160} />
          </Box>
        )}
      </Box>
      <Box sx={{ height: 10, flexShrink: 0, bgcolor: BRAND.red }} />

      <Box sx={{ flexGrow: 1, display: "flex", gap: 10, px: 12, py: 6, minHeight: 0 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Eyebrow>Upcoming Event</Eyebrow>
          <Typography component="h2" sx={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, ...clampLines(2) }}>
            {slide.title}
          </Typography>
          {slide.excerpt && (
            <Typography component="p" sx={{ fontSize: 28, lineHeight: 1.4, opacity: 0.85, ...clampLines(2) }}>
              {slide.excerpt}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            width: 560,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
            pl: 6,
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
            <CalendarMonthIcon sx={{ fontSize: 56, color: BRAND.red, mt: 0.5 }} />
            <Typography component="p" sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2 }}>
              {slide.dateLabel}
            </Typography>
          </Box>
          <ChtcLogo height={60} sx={{ alignSelf: "flex-start" }} />
        </Box>
      </Box>
    </Box>
  );
}
