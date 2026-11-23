import type { ComponentType } from "react";
import type { SxProps, Theme } from "@mui/material";

/**
 * A slide-to-slide transition.
 *
 * While a transition runs the player stacks three layers on the stage: the
 * outgoing slide (styled with `exit`), the incoming slide on top of it (styled
 * with `enter`), and finally the optional `Overlay`. After `durationMs` the
 * outgoing layer and overlay are removed and the incoming slide is left as is,
 * so `enter` must end with the slide fully visible and untransformed.
 */
export interface KioskTransition {
  /** Unique, human-readable name; also handy when debugging. */
  name: string;
  durationMs: number;
  enter: SxProps<Theme>;
  exit: SxProps<Theme>;
  /** Decorative layer drawn above both slides, e.g. a sweeping panel. */
  Overlay?: ComponentType;
}
