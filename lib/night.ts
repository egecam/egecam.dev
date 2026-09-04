/** Night runs from 19:00 to 07:00, by the reader's own clock. */
export const NIGHT_FROM = 19;
export const NIGHT_UNTIL = 7;

export const isNightAt = (d: Date = new Date()) => {
  const h = d.getHours();
  return h >= NIGHT_FROM || h < NIGHT_UNTIL;
};

/**
 * Which half of the day we are in. A manual override is stored against this,
 * and expires when it changes — so blowing the candle out at midnight does not
 * keep the page dark for good, it just holds until morning.
 */
export const periodOf = (d: Date = new Date()) => (isNightAt(d) ? "n" : "d");

export const OVERRIDE_KEY = "night";
export const PERIOD_KEY = "nightFor";

/** The override only counts while the period it was made in still stands. */
export function resolveNight(now: Date = new Date()): boolean {
  const auto = isNightAt(now);
  try {
    const value = localStorage.getItem(OVERRIDE_KEY);
    if (value !== null && localStorage.getItem(PERIOD_KEY) === periodOf(now)) {
      return value === "1";
    }
  } catch {
    // Storage disabled — the clock still decides.
  }
  return auto;
}
