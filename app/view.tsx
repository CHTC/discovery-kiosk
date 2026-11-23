"use client";

import { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { Box, Typography } from "@mui/material";

import KioskStage from "@/components/KioskStage";
import Slide, { ChtcLogo, type SlideData } from "@/components/Slide";
import { pickTransition, type KioskTransition } from "@/components/Transitions";
import { BRAND, RELOAD_INTERVAL_MS, SLIDE_DURATION_MS } from "@/lib/kiosk";

interface KioskViewProps {
  slides: SlideData[];
}

interface Phase {
  /** Index of the slide on screen (or arriving). */
  current: number;
  /** Index of the slide leaving, while a transition runs. */
  previous: number | null;
  transition: KioskTransition | null;
  /** Bumps on every advance; restarts the slide clock and progress bar. */
  seq: number;
}

const progress = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

/**
 * The kiosk player. Every {@link SLIDE_DURATION_MS} it moves to the next slide
 * through a randomly chosen transition, looping forever. Once
 * {@link RELOAD_INTERVAL_MS} has passed it reloads the page instead, which
 * picks up whatever the latest build added.
 */
export default function KioskView({ slides }: KioskViewProps) {
  const [phase, setPhase] = useState<Phase>({ current: 0, previous: null, transition: null, seq: 0 });
  const startedAt = useRef<number | null>(null);

  // Slide clock.
  useEffect(() => {
    startedAt.current ??= Date.now();
    if (slides.length < 2) return;

    const timer = window.setTimeout(() => {
      if (Date.now() - (startedAt.current ?? 0) > RELOAD_INTERVAL_MS) {
        window.location.reload();
        return;
      }
      setPhase((p) => step(p, slides, 1));
    }, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase.seq, slides]);

  // Right / left arrow: next / previous slide. Changing `seq` restarts the
  // slide clock, so the slide you land on gets its full time on screen.
  useEffect(() => {
    if (slides.length < 2) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const direction = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!direction) return;
      e.preventDefault();
      setPhase((p) => step(p, slides, direction));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides]);

  // End of a transition: drop the outgoing slide and the overlay.
  useEffect(() => {
    if (!phase.transition) return;
    const { seq } = phase;
    const timer = window.setTimeout(
      () => setPhase((p) => (p.seq === seq ? { ...p, previous: null, transition: null } : p)),
      phase.transition.durationMs,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Warm the cache with the next slide's image so it's ready when it arrives.
  const { current } = phase;
  useEffect(() => {
    if (slides.length < 2) return;
    const src = slides[(current + 1) % slides.length].image?.src;
    if (src) new window.Image().src = src;
  }, [current, slides]);

  if (slides.length === 0) {
    return (
      <KioskStage>
        <IdleSlide />
      </KioskStage>
    );
  }

  const { previous, transition, seq } = phase;
  const Overlay = transition?.Overlay;
  const layers = [
    ...(previous !== null && transition ? [{ index: previous, sx: transition.exit, leaving: true }] : []),
    { index: current, sx: transition?.enter ?? {}, leaving: false },
  ];

  return (
    <KioskStage>
      <Box
        role="region"
        aria-roledescription="carousel"
        aria-label="CHTC events and news"
        sx={{ position: "absolute", inset: 0 }}
      >
        {layers.map(({ index, sx, leaving }) => (
          <Box
            key={slides[index].id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={leaving || undefined}
            sx={{ position: "absolute", inset: 0, ...sx }}
          >
            <Slide slide={slides[index]} />
          </Box>
        ))}
        {Overlay && <Overlay key={`overlay-${seq}`} />}
      </Box>

      {slides.length > 1 && (
        <Box
          key={`progress-${seq}`}
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 8,
            bgcolor: BRAND.red,
            transformOrigin: "left",
            animation: `${progress} ${SLIDE_DURATION_MS}ms linear both`,
          }}
        />
      )}
    </KioskStage>
  );
}

/** Move one slide forward (`1`) or back (`-1`) through a random transition. */
function step(p: Phase, slides: SlideData[], direction: 1 | -1): Phase {
  const next = nextLiveIndex(slides, p.current, direction);
  if (next === p.current) return { ...p, seq: p.seq + 1 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    current: next,
    previous: reduceMotion ? null : p.current,
    transition: reduceMotion ? null : pickTransition(p.transition),
    seq: p.seq + 1,
  };
}

/**
 * The nearest slide from `from`, in `direction`, that is still worth showing:
 * events drop out once their end date has passed on the kiosk's own clock,
 * since the static build can be hours old.
 */
function nextLiveIndex(slides: SlideData[], from: number, direction: 1 | -1): number {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  for (let offset = 1; offset <= slides.length; offset++) {
    const i = (((from + direction * offset) % slides.length) + slides.length) % slides.length;
    const slide = slides[i];
    if (slide.kind !== "event" || slide.endDate >= today) return i;
  }
  return from;
}

/** Shown only if there is nothing at all to rotate. */
function IdleSlide() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        bgcolor: BRAND.red,
        color: BRAND.white,
      }}
    >
      <ChtcLogo height={180} />
      <Typography component="p" sx={{ fontSize: 44, fontWeight: 600 }}>
        chtc.wisc.edu
      </Typography>
    </Box>
  );
}
