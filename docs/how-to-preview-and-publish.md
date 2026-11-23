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

The kiosk runs the static build, not the development server. To check it
before you push:

```shell
pnpm build
npx serve out
```

Then open the address that `serve` prints.

## Publish to the kiosk

Push your commit to `main`. The **Deploy Next.js site to Pages** workflow
builds and deploys the site.

The kiosk reloads itself once an hour, so your change appears within an hour
of the deploy finishing. To see it right away, reload the kiosk's browser.

## Pick up new events and articles without a commit

The workflow also runs on a schedule, at 06:00, 12:00 and 18:00 UTC, which
picks up new events and articles. To pick them up sooner:

1. Open the repository's **Actions** tab on GitHub.
2. Select **Deploy Next.js site to Pages**.
3. Select **Run workflow** on the `main` branch.

To change the schedule, edit the `cron` line in `.github/workflows/nextjs.yml`.
