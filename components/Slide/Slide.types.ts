/**
 * Serializable slide data, built on the server and handed to the client
 * player. Kept deliberately slim: only what a slide renders.
 */

export interface SlideImage {
  src: string;
  alt: string;
}

export interface EventSlideData {
  kind: "event";
  id: string;
  title: string;
  /** Human-readable date range, e.g. `December 15–17, 2026`. */
  dateLabel: string;
  /** `YYYY-MM-DD`; the player drops the slide once this has passed. */
  endDate: string;
  excerpt?: string;
  image?: SlideImage;
}

export interface ArticleSlideData {
  kind: "article";
  id: string;
  title: string;
  /** `News` or `User Story`. */
  label: string;
  author?: string;
  dateLabel: string;
  excerpt?: string;
  image: SlideImage;
}

export interface ImageSlideData {
  kind: "image";
  id: string;
  image: SlideImage;
}

export type SlideData = EventSlideData | ArticleSlideData | ImageSlideData;
