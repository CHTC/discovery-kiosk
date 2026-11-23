import ArticleSlide from "./ArticleSlide";
import EventSlide from "./EventSlide";
import ImageSlide from "./ImageSlide";
import type { SlideData } from "./Slide.types";

/** Renders any slide onto the 1920×1080 stage. */
export default function Slide({ slide }: { slide: SlideData }) {
  switch (slide.kind) {
    case "event":
      return <EventSlide slide={slide} />;
    case "article":
      return <ArticleSlide slide={slide} />;
    case "image":
      return <ImageSlide slide={slide} />;
    default: {
      // Fails to compile if a new kind of slide is added without a case here.
      const unhandled: never = slide;
      return unhandled;
    }
  }
}
