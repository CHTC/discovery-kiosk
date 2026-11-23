/**
 * What the kiosk shows. Edit, commit, and the next build picks it up.
 */
export const kioskConfig = {
  /**
   * How many of the most recent CHTC news / user-story articles (with a card
   * image) to mix into the rotation. `0` shows no articles.
   */
  articleCount: 10,

  /**
   * How many seconds each slide stays on screen, including its transition.
   * The minimum is 5, so transitions always have time to finish.
   */
  slideSeconds: 60,
} as const;
