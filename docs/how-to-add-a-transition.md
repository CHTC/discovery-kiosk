# How to add a transition

Each transition is its own directory under `components/Transitions/`. The
kiosk picks one at random for every slide change, never the same one twice in
a row. This guide shows you how to add one, try it out, and remove one.

## Create the transition

1. Create a directory named after your transition, in PascalCase, for example
   `components/Transitions/Fade/`.

2. In it, create `Fade.tsx` that exports a `KioskTransition`:

   ```tsx
   import { keyframes } from "@emotion/react";

   import type { KioskTransition } from "../Transition.types";

   const DURATION_MS = 1000;

   const fadeIn = keyframes`
     from { opacity: 0; }
     to   { opacity: 1; }
   `;

   const fade: KioskTransition = {
     name: "Fade",
     durationMs: DURATION_MS,
     enter: { animation: `${fadeIn} ${DURATION_MS}ms ease-in-out both` },
     exit: {},
   };

   export default fade;
   ```

3. Create `index.ts` beside it:

   ```ts
   export { default } from "./Fade";
   ```

4. Add it to the list in `components/Transitions/index.ts`:

   ```ts
   import fade from "./Fade";

   export const TRANSITIONS: readonly KioskTransition[] = [redSweep, jobGrid, aperture, logoStorm, logoSpin, fade];
   ```

## What each field does

While a transition runs, the kiosk stacks three layers, bottom to top:

| Layer | Styled by | Notes |
|---|---|---|
| Outgoing slide | `exit` | Removed when the transition ends. |
| Incoming slide | `enter` | Stays on screen after the transition ends. |
| Your overlay | `Overlay` | Optional component drawn over both slides. Removed when the transition ends. |

Follow these rules, or the slide will jump when the transition ends:

- `enter` must finish with the incoming slide fully visible and untransformed.
- `durationMs` must match the length of your longest animation.

If your overlay covers the whole screen at some moment, swap the slides then.
To do that, hide the incoming slide until that moment. `JobGrid` and
`LogoStorm` both use this approach, switching at 50%:

```ts
const swapIn = keyframes`
  0%, 49.99% { visibility: hidden; }
  50%, 100%  { visibility: visible; }
`;
```

Lay out overlays in 1920×1080 pixels. The kiosk scales the whole screen to fit.
For brand colors and the logo path, import `BRAND` and `BASE_PATH` from
`@/lib/kiosk`.

## Try it out

1. Make yours the only transition for now:

   ```ts
   export const TRANSITIONS: readonly KioskTransition[] = [fade];
   ```

2. Start the preview with `pnpm dev`, open http://localhost:3000 and press the
   right arrow key to run the transition.
3. To study it frame by frame, temporarily raise `DURATION_MS` in your file,
   for example to `10_000`.
4. Restore the full `TRANSITIONS` list and `DURATION_MS` when you're done.

## Remove a transition

Delete it from the `TRANSITIONS` list in `components/Transitions/index.ts`,
then delete its directory.

Keep at least one transition in the list. With two or more, the kiosk never
repeats one back to back.

Viewers whose system is set to reduce motion get an instant cut instead of
any transition.
