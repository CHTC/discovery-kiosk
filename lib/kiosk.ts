/**
 * Kiosk tuning knobs. Safe to import from both server and client code.
 * Content settings people are expected to change live in `kiosk.config.ts`.
 */
import { kioskConfig } from "@/kiosk.config";

/** The kiosk renders onto a fixed 1080p canvas, scaled to fit the screen. */
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/** How long each slide stays up, from the start of one transition to the next. */
export const SLIDE_DURATION_MS = 10_000;

/**
 * Number of recent CHTC news / user articles mixed into the rotation. Set in
 * `kiosk.config.ts`; anything that isn't a whole number ≥ 0 counts as 0.
 */
export const ARTICLE_COUNT = Math.max(0, Math.floor(Number(kioskConfig.articleCount) || 0));

/**
 * The page reloads itself (between slides) after this long, so the kiosk picks
 * up a fresh build — new events, articles and dropped-in images — without
 * anyone touching it.
 */
export const RELOAD_INTERVAL_MS = 60 * 60 * 1000;

/** Folder under `public/` whose images are added to the rotation. */
export const SLIDE_IMAGE_DIR = "slides";

/** File types picked up from {@link SLIDE_IMAGE_DIR}. */
export const SLIDE_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"];

/** CHTC brand colors, from https://chtc.wisc.edu/branding/. */
export const BRAND = {
  red: "#B61F24",
  darkRed: "#7A1518",
  black: "#000000",
  white: "#FFFFFF",
} as const;

/** Prefix for root-relative asset URLs, so they survive a `basePath` deploy. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
