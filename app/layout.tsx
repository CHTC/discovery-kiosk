import type { Metadata } from "next";

import {Box} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

import { chtcTheme as theme, chtcFonts as fonts } from "@chtc/web-components/themes"

import "./globals.css"
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/site.config";

/*
 * Site-wide metadata. Every page inherits what it does not set, so this holds
 * only the fields that are true of the whole site.
 *
 * `openGraph` and `twitter` deliberately carry no title, description or url:
 * a child that sets plain `title`/`description` does not get its values
 * copied into an inherited `openGraph` block, so anything named here would
 * stick on every page. Left unset, Next fills og:title and og:description
 * from each page's own title and description. The shared og:image comes from
 * `opengraph-image.png` in this folder, which applies to every route.
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
	// The bare origin, not `siteConfig.url`: Next already prefixes the base path
	// onto file-based images like `opengraph-image.png`, and would double it.
	metadataBase: new URL(siteConfig.origin),
	applicationName: siteConfig.name,
	openGraph: {
		type: "website",
		siteName: siteConfig.name,
		locale: siteConfig.locale,
	},
	twitter: {
		card: "summary_large_image",
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map(font => font.className).join(' ')}>
			{ process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
				<Analytics url={process.env.NEXT_PUBLIC_MATOMO_URL} siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID} />
			}
      <AppRouterCacheProvider>
        {/*
          ThemeProvider has to wrap CssBaseline and the body Box, not just the
          page content: both read from the theme, and outside the provider they
          resolve against MUI's default one.
        */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/*
            Full-screen signage: no banner, header or footer, and nothing may
            scroll. The kiosk page draws its own fixed 1080p stage.
          */}
          <Box component={"body"} sx={{ margin: 0, padding: 0, bgcolor: '#000', color: 'text.primary', height: '100vh', overflow: 'hidden' }}>
            <Box component="main" sx={{ height: '100%' }}>
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
