import type { Game, HeroState } from './data/types'

/**
 * Derive the home MatchdayHero state from fixture data + server time, never a
 * manual flag (handoff "Hero state machine"). Precedence: a live game wins;
 * otherwise an imminent/next scheduled game (upcoming, drives the countdown);
 * a very recent finished game shows the result; a postponed next game shows
 * postponed; nothing scheduled ⇒ summer break.
 */
export function deriveHeroState(games: Game[], now: Date = new Date()): { state: HeroState; game?: Game } {
  const sorted = [...games].sort((a, b) => a.kickoff.localeCompare(b.kickoff))
  const nowMs = now.getTime()

  const live = sorted.find((g) => g.status === 'live')
  if (live) return { state: 'live', game: live }

  const upcoming = sorted.find(
    (g) =>
      (g.status === 'scheduled' || g.status === 'postponed') &&
      new Date(g.postponedTo ?? g.kickoff).getTime() >= nowMs,
  )

  // A finished game within the last ~3 days takes the hero as a fresh result.
  const recentlyFinished = [...sorted]
    .reverse()
    .find(
      (g) =>
        g.status === 'finished' &&
        nowMs - new Date(g.kickoff).getTime() < 3 * 24 * 60 * 60 * 1000,
    )

  if (upcoming) {
    if (upcoming.status === 'postponed') return { state: 'postponed', game: upcoming }
    // If a very recent result exists and the next game is far off, show the result.
    if (recentlyFinished && new Date(upcoming.kickoff).getTime() - nowMs > 14 * 24 * 60 * 60 * 1000) {
      return { state: 'finished', game: recentlyFinished }
    }
    return { state: 'upcoming', game: upcoming }
  }

  if (recentlyFinished) return { state: 'finished', game: recentlyFinished }
  return { state: 'summer-break' }
}

/** Coerce a `?hero=` query value to a valid state for previewing all five. */
export function parseHeroOverride(value?: string | null): HeroState | undefined {
  const allowed: HeroState[] = ['upcoming', 'live', 'finished', 'postponed', 'summer-break']
  return allowed.find((s) => s === value)
}
