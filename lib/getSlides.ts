// Server-only: reads the filesystem and GitHub at build time.
import { readdir } from "node:fs/promises";
import path from "node:path";

import {
  filterEvents,
  formatEventDate,
  getArticle,
  getEvents,
  isDatedMarkdown,
  splitEvents,
  type BackendArticle,
} from "@chtc/web-components/content";
import { getRepoPaths } from "@chtc/web-components/github";

import type {
  ArticleSlideData,
  EventSlideData,
  ImageSlideData,
  SlideData,
  SlideImage,
} from "@/components/Slide";
import {
  ARTICLE_COUNT,
  BASE_PATH,
  SLIDE_IMAGE_DIR,
  SLIDE_IMAGE_EXTENSIONS,
} from "@/lib/kiosk";

const ORG = "CHTC";
const SITE = "chtc";

/** Articles are fetched newest-first in batches of this size until enough qualify. */
const ARTICLE_BATCH_SIZE = 15;

/**
 * Every slide in the rotation, in display order.
 *
 * Upcoming events are the backbone: one plays before every article or image,
 * cycling through the events as often as needed, so they keep coming round
 * even when there are only one or two of them. Articles and images are
 * interleaved with each other.
 */
export async function getSlides(): Promise<SlideData[]> {
  const [events, articles, images] = await Promise.all([
    getUpcomingEventSlides(),
    getRecentArticleSlides(),
    getLocalImageSlides(),
  ]);
  return alternateWithEvents(events, interleave<SlideData>(articles, images));
}

/** e1, o1, e2, o2, e1, o3, … — events repeat; repeated slides get unique ids. */
export function alternateWithEvents(events: EventSlideData[], others: SlideData[]): SlideData[] {
  if (events.length === 0) return others;
  const out: SlideData[] = [];
  const length = Math.max(events.length, others.length);
  for (let i = 0; i < length; i++) {
    const event = events[i % events.length];
    out.push(i < events.length ? event : { ...event, id: `${event.id}#${i}` });
    if (i < others.length) out.push(others[i]);
  }
  return out;
}

/** Upcoming CHTC events from CHTC/Events, soonest first. */
export async function getUpcomingEventSlides(): Promise<EventSlideData[]> {
  const events = filterEvents(await getEvents(ORG, "Events", "main"), SITE);
  return splitEvents(events).upcoming.map((event) => ({
    kind: "event",
    id: `event:${event.path}`,
    title: event.title,
    dateLabel: formatEventDate(event.start_date, event.end_date),
    endDate: event.end_date,
    excerpt: toPlainText(event.excerpt),
    image: toSlideImage(event.image?.path, event.image?.alt ?? event.title),
  }));
}

/**
 * The {@link ARTICLE_COUNT} most recent CHTC news and user-story articles that
 * have a card image.
 *
 * The Articles repo holds over a thousand files, so rather than fetching them
 * all, paths are walked newest-first and fetched a batch at a time until
 * enough qualify.
 */
export async function getRecentArticleSlides(): Promise<ArticleSlideData[]> {
  const paths = (await getRepoPaths(ORG, "Articles", "main"))
    .filter(isDatedMarkdown)
    .sort((a, b) => pathDate(b) - pathDate(a));

  const found: BackendArticle[] = [];
  for (let i = 0; i < paths.length && found.length < ARTICLE_COUNT; i += ARTICLE_BATCH_SIZE) {
    const batch = await Promise.all(
      paths
        .slice(i, i + ARTICLE_BATCH_SIZE)
        // One malformed article should not take the kiosk down with it.
        .map((p) => getArticle(ORG, "Articles", p, "main").catch(() => null)),
    );
    found.push(...batch.filter((a): a is BackendArticle => a !== null && isKioskArticle(a)));
  }

  return found.slice(0, ARTICLE_COUNT).map((article) => ({
    kind: "article",
    id: `article:${article.path}`,
    title: article.title,
    label: article.type === "user" ? "User Story" : "News",
    author: article.author,
    dateLabel: article.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    excerpt: toPlainText(article.excerpt),
    // isKioskArticle guarantees an absolute image path.
    image: toSlideImage(article.image.path, article.image.alt ?? article.title)!,
  }));
}

/** Images dropped into `public/slides/`, alphabetically by file name. */
export async function getLocalImageSlides(): Promise<ImageSlideData[]> {
  const dir = path.join(process.cwd(), "public", SLIDE_IMAGE_DIR);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => !f.startsWith(".") && SLIDE_IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      kind: "image",
      id: `image:${file}`,
      image: {
        src: `${BASE_PATH}/${SLIDE_IMAGE_DIR}/${encodeURIComponent(file)}`,
        alt: altFromFileName(file),
      },
    }));
}

function isKioskArticle(article: BackendArticle): boolean {
  return (
    article.publish_on?.includes(SITE) &&
    (article.type === "news" || article.type === "user") &&
    isAbsoluteUrl(article.image?.path)
  );
}

/** Round-robin across lists: a1, b1, c1, a2, b2, c2, … skipping exhausted lists. */
export function interleave<T>(...lists: T[][]): T[] {
  const out: T[] = [];
  const longest = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < longest; i++) {
    for (const list of lists) {
      if (i < list.length) out.push(list[i]);
    }
  }
  return out;
}

function toSlideImage(src: string | undefined, alt: string): SlideImage | undefined {
  return isAbsoluteUrl(src) ? { src: src!, alt } : undefined;
}

function isAbsoluteUrl(value: string | undefined): boolean {
  return typeof value === "string" && /^https?:\/\//.test(value.trim());
}

/** Sortable number from a `YYYY-M-D-title.md` path; months/days may be one digit. */
function pathDate(p: string): number {
  const [, y, m, d] = p.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-/) ?? [];
  return Number(y) * 10_000 + Number(m) * 100 + Number(d);
}

/** Strip the markdown an excerpt is likely to carry; kiosk slides show plain text. */
function toPlainText(markdown: string | undefined): string | undefined {
  if (!markdown) return undefined;
  const text = markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined;
}

/** `team-photo_2026.jpg` → `team photo 2026`. */
function altFromFileName(file: string): string {
  return path.parse(file).name.replace(/[-_]+/g, " ").trim();
}
