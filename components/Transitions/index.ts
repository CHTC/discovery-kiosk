/**
 * Every transition the kiosk can pick from.
 *
 * To add one: create a directory beside these exporting a `KioskTransition`
 * (see `Transition.types.ts`), then add it to {@link TRANSITIONS}.
 */
import aperture from "./Aperture";
import jobGrid from "./JobGrid";
import logoSpin from "./LogoSpin";
import logoStorm from "./LogoStorm";
import redSweep from "./RedSweep";
import type { KioskTransition } from "./Transition.types";

export const TRANSITIONS: readonly KioskTransition[] = [redSweep, jobGrid, aperture, logoStorm, logoSpin];

/** A random transition, never the same one twice in a row when there's a choice. */
export function pickTransition(previous?: KioskTransition | null): KioskTransition {
  const pool = TRANSITIONS.length > 1 ? TRANSITIONS.filter((t) => t !== previous) : TRANSITIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export type { KioskTransition } from "./Transition.types";
