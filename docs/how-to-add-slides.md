# How to add and remove slides

The kiosk shows three kinds of slides: images you add to this repository,
upcoming events from [CHTC/Events](https://github.com/CHTC/Events), and recent
articles from [CHTC/Articles](https://github.com/CHTC/Articles). This guide
shows you how to get each one on screen and how to take it off.

Every change appears on the kiosk after the next build. To see it sooner, see
[How to preview and publish changes](how-to-preview-and-publish.md).

## Add an image

1. Put the image file in `public/slides/`. Use `.jpg`, `.jpeg`, `.png`,
   `.webp`, `.gif`, `.avif` or `.svg`.
2. Name the file so it describes the image, with words separated by hyphens or
   underscores. The kiosk turns the name into the image's alt text:
   `htc26-group-photo.jpg` becomes "htc26 group photo".
3. Commit the file and push it to `main`.

Images can be any shape. The kiosk shows the whole image, centered over a
blurred copy of itself. A 1920×1080 image fills the screen exactly.

**To control the order**, prefix the file names with numbers. Images play in
alphabetical order, so `01-welcome.png` plays before `02-htc27.png`.

**To remove an image**, delete its file from `public/slides/` and push.

## Add an event

Events come from the CHTC/Events repository, so you add them there, not here.
Follow that repository's README to create the event, then check that its front
matter meets these conditions:

| Field | What the kiosk needs |
|---|---|
| `publish_on` | Must include `chtc`. |
| `published` | Must not be `false`. Leaving it out is fine. |
| `end_date` | Today or later. The event leaves the kiosk the day after it ends. |
| `title` | Shown in large type. Keep it short: only two lines fit. |
| `excerpt` | Optional. Only two lines fit. |
| `image.path` | Optional. Must be a full `https://` URL. |
| `image.alt` | Describe the image. Used if `image.path` is set. |

The event image appears whole on a white band, the same way event cards look
on the website. If the event has no image, the kiosk shows a red band with the
CHTC logo instead.

**To remove an event**, set `published: false` or remove `chtc` from
`publish_on` in CHTC/Events.

## Get an article onto the kiosk

The kiosk shows the most recent articles in CHTC/Articles that meet all of
these conditions:

| Field | What the kiosk needs |
|---|---|
| `publish_on` | Must include `chtc`. |
| `type` | Must be `news` or `user`. Tech blog posts are not shown. |
| `image.path` | Must be a full `https://` URL. |

"Most recent" goes by the date at the start of the file name, such as
`2026-10-27-running-af3-at-scale-using-chtc.md`.

Use a 2:1 image (for example 1920×960). It fills the top of the slide without
cropping. Keep the title to three lines and the excerpt to two.

**To show more or fewer articles**, change `articleCount` in
`kiosk.config.ts`. See [Kiosk settings reference](settings-reference.md).

**To drop one particular article**, you have to change the article itself in
CHTC/Articles, because the kiosk always takes the newest ones that qualify.
Changing an article affects the CHTC website too, so check with whoever owns it
first.

## Change how long each slide stays up

Set `slideSeconds` in `kiosk.config.ts`. The default is `60`, and the minimum
is `5`. Every slide gets the same time.

## How slides are ordered

An event plays before every article or image. When there are fewer events than
other slides, the events repeat. Articles and images alternate with each other:

```
event 1, article 1, event 2, image 1, event 1, article 2, event 2, image 2, …
```

The rotation then loops back to the start.
