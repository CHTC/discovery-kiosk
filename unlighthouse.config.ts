// The production URL. To scan a local build, serve it as described in
// docs/how-to-preview-and-publish.md and set
// UNLIGHTHOUSE_SITE=http://localhost:3000/discovery-kiosk/. Keep the trailing
// slash: the sitemap is looked up relative to it.
const SITE = process.env.UNLIGHTHOUSE_SITE ?? 'https://chtc.github.io/discovery-kiosk/'

/**
 * The path of a sitemap `<loc>`. A sitemap built with a `HOSTNAME` that
 * already has a scheme reads `https://http://host/path`, which `new URL()`
 * takes as host `http`, so the scheme(s) and host are stripped by hand.
 */
const locPath = (loc: string) => loc.replace(/^(?:https?:\/\/)+[^/]*/, '') || '/'

async function fetchLocs(path: string): Promise<string[]> {
	const res = await fetch(new URL(path, SITE))
	if (!res.ok)
		throw new Error(`Failed to fetch ${path} from ${SITE}: ${res.status}`)
	const xml = await res.text()
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
}

// next-sitemap writes absolute URLs for the production host, so read the
// sitemaps from SITE ourselves and keep only each entry's path.
async function sitemapPaths(): Promise<string[]> {
	// Relative, so it resolves under the base path rather than the domain root.
	const sitemaps = await fetchLocs('sitemap.xml')
	const locs = (await Promise.all(sitemaps.map((loc) => fetchLocs(locPath(loc))))).flat()
	const paths = locs
		.map(locPath)
		// trailingSlash: true, so request the canonical URL and avoid a redirect per page
		.map((path) => (path.endsWith('/') ? path : `${path}/`))
		.filter((path) => path !== '/404/')
		// Search Console's site-verification file, not a page
		.filter((path) => !/^\/google[0-9a-f]+\/$/.test(path))
	return [...new Set(paths)]
}

const config = {
	site: SITE,
	urls: sitemapPaths,
	scanner: {
		dynamicSampling: true,
		samples: 5,
		throttle: true,
		maxRoutes: false,
	},
	puppeteerClusterOptions: {
		maxConcurrency: 1,
	},
}

export default config
