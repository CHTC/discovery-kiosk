import { getSlides } from "@/lib/getSlides";

import KioskView from "./view";

/**
 * The kiosk. Slides are gathered at build time — upcoming CHTC events, recent
 * CHTC articles and the images in `public/slides/` — and rotated in the
 * browser by {@link KioskView}.
 */
export default async function Home() {
  const slides = await getSlides();
  return <KioskView slides={slides} />;
}
