# Kiosk settings reference

Every setting takes effect on the next build.

## `kiosk.config.ts`

| Setting | Default | Description |
|---|---|---|
| `articleCount` | `5` | Number of recent CHTC articles in the rotation. `0` shows none. Decimals round down; negative or non-numeric values count as `0`. |

## `lib/kiosk.ts`

| Setting | Default | Description |
|---|---|---|
| `SLIDE_DURATION_MS` | `10_000` | Milliseconds each slide stays up, including its transition. |
| `RELOAD_INTERVAL_MS` | `3_600_000` (1 hour) | The page reloads itself, between slides, after this many milliseconds. Reloading picks up the latest deploy. |
| `SLIDE_IMAGE_DIR` | `"slides"` | Folder under `public/` whose images join the rotation. |
| `SLIDE_IMAGE_EXTENSIONS` | `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif` `.svg` | File types picked up from that folder. |
| `BRAND` | red `#B61F24`, dark red `#7A1518`, black, white | Colors used by slides and transitions. Red and black come from https://chtc.wisc.edu/branding/. |
| `STAGE_WIDTH`, `STAGE_HEIGHT` | `1920`, `1080` | Size of the canvas slides are drawn on. Every slide and transition is laid out for this size, so changing it means redesigning them. |

## `lib/getSlides.ts`

| Setting | Default | Description |
|---|---|---|
| `ORG` | `"CHTC"` | GitHub organization holding the Events and Articles repositories. |
| `SITE` | `"chtc"` | Value that must appear in an event's or article's `publish_on`. |
| `ARTICLE_BATCH_SIZE` | `15` | Articles fetched at a time, newest first, while looking for ones that qualify. |

## Transition timing

Each transition sets its own length in a `DURATION_MS` constant at the top of
its file in `components/Transitions/`.

| Transition | Length |
|---|---|
| RedSweep | 1.4 s |
| JobGrid | 1.8 s |
| Aperture | 1.5 s |
| LogoStorm | 2.0 s |
| LogoSpin | 1.8 s |

## Environment variables

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Optional. Raises GitHub's limit from 60 to 5,000 requests an hour. The deploy workflow sets it automatically. |
| `NEXT_PUBLIC_BASE_PATH` | URL prefix when the site isn't served from the root of its domain, for example `/kiosk`. |

## Build schedule

`.github/workflows/nextjs.yml` rebuilds and deploys on every push to `main`
and at 06:00, 12:00 and 18:00 UTC (`cron: '0 6,12,18 * * *'`).
