/** @type {import('next-sitemap').IConfig} */
module.exports = {
	// Includes the base path, so every <loc> is a full URL under the subdirectory.
	siteUrl: `${process.env.HOSTNAME ? `https://${process.env.HOSTNAME}` : 'https://example.com'}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`,
	output: "export",
	// Match `trailingSlash: true` in next.config.mjs
	trailingSlash: true,
}
