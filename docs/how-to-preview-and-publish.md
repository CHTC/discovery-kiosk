# How to preview and publish changes

This guide shows you how to see your changes on your own computer and how to
get them onto the kiosk.

## Preview on your computer

1. Install the dependencies once:

   ```shell
   pnpm install
   ```

2. Start the development server:

   ```shell
   pnpm dev
   ```

3. Open http://localhost:3000.

The page updates when you save a file. To see images you added to
`public/slides/`, reload the page.

The preview fetches events and articles from GitHub. If you reload it many
times in an hour, GitHub may start refusing requests. To raise that limit, give
the server a GitHub token:

```shell
GITHUB_TOKEN=$(gh auth token) pnpm dev
```

Use the right and left arrow keys to jump between slides instead of waiting.

## Check the production build

The kiosk runs the static build, not the development server. Unlike the
development server, the build lives under `/discovery-kiosk/`, as it will on
GitHub Pages. Copy it into a folder of that name before serving it:

```shell
pnpm build
rm -rf .preview && mkdir .preview && cp -R out .preview/discovery-kiosk
npx serve .preview
```

Then open http://localhost:3000/discovery-kiosk/.

## Publish to the kiosk

Push your commit to `main`. The **Deploy Next.js site to Pages** workflow
builds the site and deploys it to https://chtc.github.io/discovery-kiosk/.

The kiosk reloads itself once an hour, so your change appears within an hour
of the deploy finishing. To see it right away, reload the kiosk's browser.

## Pick up new events and articles without a commit

The workflow also runs on a schedule, at 06:00, 12:00 and 18:00 UTC, which
picks up new events and articles. To pick them up sooner:

1. Open the repository's **Actions** tab on GitHub.
2. Select **Deploy Next.js site to Pages**.
3. Select **Run workflow** on the `main` branch.

To change the schedule, edit the `cron` line in `.github/workflows/nextjs.yml`.

## Move the site to a different address

The published address is set in `.env.production`, which only the build reads.
The development server ignores it and always serves from the root.

| Variable | Current value | Meaning |
|---|---|---|
| `HOSTNAME` | `chtc.github.io` | Host the site is published on. |
| `NEXT_PUBLIC_BASE_PATH` | `/discovery-kiosk` | Folder the site lives in on that host. Use an empty value for the root of a domain. |

If you change `NEXT_PUBLIC_BASE_PATH`, also change `BASE_PATH` in the
`link-check` job of `.github/workflows/nextjs.yml` to match.
