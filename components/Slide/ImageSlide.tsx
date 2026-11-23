import { Box } from "@mui/material";

import { BRAND } from "@/lib/kiosk";

import type { ImageSlideData } from "./Slide.types";
import { FramedImage } from "./SlideParts";

/**
 * A dropped-in image, shown whole. Images that aren't 16:9 sit on a blurred,
 * dimmed copy of themselves instead of black bars.
 */
export default function ImageSlide({ slide }: { slide: ImageSlideData }) {
  return (
    <Box sx={{ position: "absolute", inset: 0, bgcolor: BRAND.black, overflow: "hidden" }}>
      <FramedImage src={slide.image.src} alt={slide.image.alt} />
    </Box>
  );
}
