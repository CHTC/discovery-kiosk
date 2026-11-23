/**
 * What this site is.
 *
 * The name, the one-line description and the URL live here and
 * `app/layout.tsx`, `app/manifest.ts` and `app/robots.ts` read from this
 * module, so changing any of them is a one-place edit.
 *
 * Server-side only: `HOSTNAME` is a plain build variable, not a
 * `NEXT_PUBLIC_` one, so a client component importing this would read
 * `undefined` for {@link siteConfig.url}.
 */
export const siteConfig = {
  name: 'CHTC Discovery Kiosk',
  shortName: 'CHTC Kiosk',
  description: 'Rotating display of upcoming CHTC events and news for the CHTC kiosk',
  locale: 'en_US',
  /**
   * The site-wide share image.
   *
   * `app/opengraph-image.jpg` already covers every page that does not define
   * its own `openGraph` block. A page that does define one has to name an
   * image explicitly, because Next replaces the inherited block wholesale
   * rather than merging it — this is that same file.
   */
  shareImage: {
    // Resolved against `metadataBase`, which is the bare origin, so the base
    // path has to be included here.
    url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/opengraph-image.jpg`,
    width: 1203,
    height: 630,
    alt: 'Center for High Throughput Computing — UW-Madison',
  },
  /**
   * Path the site is served under, e.g. `/discovery-kiosk` for
   * https://chtc.github.io/discovery-kiosk/. Set in `.env.production` for
   * builds; empty in development, which serves from the root.
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  /** Scheme and host only, e.g. `https://chtc.github.io`. Set per deployment. */
  origin: process.env.HOSTNAME ? `https://${process.env.HOSTNAME}` : 'https://example.com',
  /**
   * Absolute URL of the site's root, base path included and no trailing
   * slash. The sitemap and robots.txt need it absolute.
   */
  url: `${process.env.HOSTNAME ? `https://${process.env.HOSTNAME}` : 'https://example.com'}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`,
  /** Contact address for the 404 page and the footer's accessibility link. */
  email: 'chtc@wisc.edu',
} as const;
