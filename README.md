# CHTC Discovery Kiosk

A full-screen rotating display for the CHTC kiosk TV. Open
https://chtc.github.io/discovery-kiosk/ and it cycles through slides on its
own, one a minute by default, with a randomly chosen transition between each.

## Documentation

- [How to add and remove slides](docs/how-to-add-slides.md): images, events and articles
- [How to preview and publish changes](docs/how-to-preview-and-publish.md)
- [How to change how slides look](docs/how-to-edit-slide-designs.md)
- [How to add a transition](docs/how-to-add-a-transition.md)
- [Kiosk settings reference](docs/settings-reference.md): every setting, its default and where it lives

## What it shows

- **Upcoming CHTC events** from [CHTC/Events](https://github.com/CHTC/Events).
- **The most recent CHTC news and user-story articles** that have a card image,
  from [CHTC/Articles](https://github.com/CHTC/Articles). Ten, as currently configured.
- **Any images in `public/slides/`.**

An event plays before every article or image, so events are always in
rotation.

## How it stays current

The site is a static export. `.github/workflows/nextjs.yml` builds and deploys
it on every push to `main` and three times a day. The page reloads itself once
an hour to load the latest deploy. Events drop out the day after they end,
going by the kiosk's own clock, even if the build is older.

## Display and controls

Slides are drawn on a fixed 1920×1080 canvas that is scaled to fit the window,
so they look the same on the 1080p TV as in a browser preview. Run the browser
full screen or in kiosk mode, for example `chromium --kiosk <url>`.

Press the **right arrow** for the next slide and the **left arrow** for the
previous one. Either key restarts the slide timer.

## Transitions

One is picked at random for each slide change, never the same one twice in a
row:

- **RedSweep**: an angled CHTC-red panel wipes across and paints the next slide on behind it.
- **JobGrid**: a 16×9 grid of red and black "jobs" cascades in to cover the screen, then drains away to show the next slide.
- **Aperture**: the next slide opens from the center inside an expanding red ring while the old one recedes.
- **LogoStorm**: a hurricane of CHTC logos whips around the center over a spinning red-and-black vortex, then flings outward to reveal the next slide.
- **LogoSpin**: a single CHTC logo spins about its vertical axis, growing to fill the screen and then shrinking away.

Viewers whose system is set to reduce motion get an instant cut instead.

# NPM Stack

## Next.js

React framework used for building the static website.

https://nextjs.org/

## Material UI

Used for components, icons, and theming.

You can find the CHTC, OSG, and Pelican MUI themes in `@chtc/web-components/themes`.

https://mui.com/

### Styling with the SX prop

https://mui.com/system/getting-started/usage/

Material UI uses the `sx` prop for styling components. This allows you to apply styles directly to components using a JavaScript object syntax.

Since we integrate with MUI themes, you can use the sx prop to access theme values like colors, spacing, and typography.

## CHTC Web Components

Reusable components and themes for CHTC websites.

https://path-cc.io/web-components/ for now, but moving to https://chtc.github.io/web-components/

# Development

## Docker

This is the easiest, if you have something quick I would do this.

Run the command below and navigate to http://localhost:3000.

```shell
docker compose up
```

## PNPM

[Install pnpm](https://pnpm.io/installation) and run `pnpm install` (only need to do it once).

Run `pnpm run dev`.

This will be the fastest if you aren't on linux.

The pnpm version is pinned by the `packageManager` field in `package.json`; CI and Docker use the same one.

# Configuration

- **`site.config.ts`** holds the site's name, description, contact email and URL. The layout, `robots.txt`, the web manifest and the 404 page all read from it.
- **`app/opengraph-image.png`** is the share image for every page. Replace it (and `app/opengraph-image.alt.txt`) with the site's own artwork.
- **`static-redirects.json`** lists old URLs to forward to new ones, as `{ "source": "/old/", "destination": "/new/" }`. Since a static export can't redirect on the server, `scripts/generate-redirects.mjs` writes a small redirect page at each source after the build.

# Site Checks

## Link Checking

- **Internal links** are checked on every pull request by the `link-check` job in `.github/workflows/nextjs.yml`, which fails if any link within the built site is broken.
- **External links** are checked daily by `.github/workflows/external-links.yml`. External sites fail transiently, so `scripts/external-link-history.mjs` records when each link started failing and the job only fails for links that have been broken for a week.

## Lighthouse Audits

[Unlighthouse](https://unlighthouse.dev/) runs Lighthouse against every page in the sitemap.

The production URL is already set in `unlighthouse.config.ts`; run `pnpm run unlighthouse:live`.

To scan a local build instead, serve it as described in [How to preview and publish changes](docs/how-to-preview-and-publish.md#check-the-production-build) and run `UNLIGHTHOUSE_SITE=http://localhost:3000/discovery-kiosk/ pnpm run unlighthouse:live`.

