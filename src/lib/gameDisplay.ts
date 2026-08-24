import type { Game, Side } from './data/types'
import type { MatchStatus } from '@/components/ui/StatusTag'

/** Whether a side is a DBB squad (vs an external opponent). */
export const isDBB = (side: Side): boolean => side.kind === 'team'

/** The DBB side of a game, if any (used to compute win/draw/loss). */
export function dbbSide(game: Game): 'home' | 'away' | null {
  if (isDBB(game.home)) return 'home'
  if (isDBB(game.away)) return 'away'
  return null
}

/**
 * The status vocabulary a fixture row / scoreboard renders. A finished game
 * resolves to win/draw/loss from the DBB perspective; everything else keeps its
 * lifecycle status. Falls back to draw-coloured neutral when no DBB side exists
 * (e.g. a tournament game between two clubs).
 */
export function displayStatus(game: Game): MatchStatus {
  if (game.status === 'finished' && game.homeScore != null && game.awayScore != null) {
    const side = dbbSide(game)
    if (!side) return game.homeScore === game.awayScore ? 'draw' : 'win'
    const gf = side === 'home' ? game.homeScore : game.awayScore
    const ga = side === 'home' ? game.awayScore : game.homeScore
    if (gf > ga) return 'win'
    if (gf < ga) return 'loss'
    return 'draw'
  }
  return game.status as MatchStatus
}

/** Score to show, or null when no score should appear (scheduled/postponed/cancelled). */
export function scorePair(game: Game): { home: number; away: number } | null {
  if ((game.status === 'finished' || game.status === 'live') && game.homeScore != null && game.awayScore != null) {
    return { home: game.homeScore, away: game.awayScore }
  }
  return null
}

/** Days until kickoff (>= 0), for the preview "Anpfiff in N Tagen" line. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const ms = new Date(iso).getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}
