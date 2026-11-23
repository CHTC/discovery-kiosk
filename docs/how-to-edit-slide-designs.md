# How to change how slides look

This guide shows you where each slide's design lives, how to change it, and
how to add a new kind of slide.

## Find the right file

All slide designs are in `components/Slide/`:

| To change... | Edit |
|---|---|
| Event slides | `EventSlide.tsx` |
| Article slides | `ArticleSlide.tsx` |
| Image slides from `public/slides/` | `ImageSlide.tsx` |
| The logo, the red "UPCOMING EVENT" label, blurred image backgrounds | `SlideParts.tsx` |
| The screen shown when there is nothing to rotate | `IdleSlide` in `app/view.tsx` |
| The red progress bar | `app/view.tsx` |
| Brand colors | `BRAND` in `lib/kiosk.ts` |

## Change a design

Slides are drawn on a fixed 1920×1080 canvas, which the kiosk scales to fit
the screen. Give sizes in pixels and they come out exactly that size on the
1080p TV.

- **Font sizes** are plain numbers of pixels: `fontSize: 60`.
- **Spacing** (`p`, `px`, `gap`, `mt`, …) uses MUI's 8-pixel unit: `gap: 3`
  is 24 pixels. Use a string for exact pixels: `gap: "20px"`.
- **To limit text to a number of lines**, spread `clampLines(n)` into its
  `sx`. Longer text ends with "…".

Check your change in the preview (`pnpm dev`) with real content. Use the arrow
keys to reach the slide. Try the longest title you expect, so you know it
still fits.

## Show a different field from an event or article

The slide components receive a slimmed-down copy of each event or article.
To show a field they don't have yet:

1. Add the field to the slide's type in `components/Slide/Slide.types.ts`.
2. Fill it in where the slide is built in `lib/getSlides.ts`:
   `getUpcomingEventSlides` for events, `getRecentArticleSlides` for articles.
   The full event or article object is available there.
3. Use it in the slide component.

## Add a new kind of slide

1. In `components/Slide/Slide.types.ts`, add an interface with a unique
   `kind`, and add it to the `SlideData` union:

   ```ts
   export interface QuoteSlideData {
     kind: "quote";
     id: string;
     text: string;
     author: string;
   }

   export type SlideData = EventSlideData | ArticleSlideData | ImageSlideData | QuoteSlideData;
   ```

2. Create `components/Slide/QuoteSlide.tsx`. Start the component with a
   full-screen box, as the other slides do:

   ```tsx
   <Box sx={{ position: "absolute", inset: 0, bgcolor: BRAND.black, color: BRAND.white }}>
   ```

3. Add a `case "quote"` to the `switch` in `components/Slide/Slide.tsx`.
4. In `lib/getSlides.ts`, write a function that returns your slides, call it
   in `getSlides`, and add the results to the order. Every `id` must be
   unique.

Until you do step 3, TypeScript reports an error in `Slide.tsx`, so you can't
miss it.
