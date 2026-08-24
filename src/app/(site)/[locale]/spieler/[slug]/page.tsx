import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPlayer, getTeam, getRelatedPlayers, getFixtures } from '@/lib/data'
import { ImageSlot } from '@/components/sport/ImageSlot'
import { GhostNumber } from '@/components/sport/GhostNumber'
import { PlayerCard } from '@/components/sport/PlayerCard'
import { FixtureRow } from '@/components/sport/FixtureRow'
import { KeyValuePanel, type KV } from '@/components/sport/KeyValuePanel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const player = await getPlayer(slug)
  return { title: player ? `${player.firstName} ${player.lastName}` : 'Spieler' }
}

export default async function PlayerPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const player = await getPlayer(slug)
  if (!player) notFound()

  const t = await getTranslations({ locale, namespace: 'screens.player' })
  const tt = await getTranslations({ locale, namespace: 'screens.teams' })
  const tp = await getTranslations({ locale, namespace: 'sport.position' })
  const team = await getTeam(player.teamSlug)
  const related = await getRelatedPlayers(player, 4)
  const allGames = await getFixtures({ team: player.teamSlug })
  const appearances = allGames
    .filter((g) => [g.roster?.home, g.roster?.away].some((r) => r?.players.some((p) => p.playerSlug === slug)))
    .slice(0, 3)

  const hasPortrait = player.portrait !== null
  const hasBio = player.bio != null && player.bio !== ''
  const isAlumni = player.status === 'alumni'

  const steckbrief: KV[] = [
    { label: t('number'), value: player.number },
    { label: t('position'), value: tp(player.position) },
    ...(player.birthYear ? [{ label: t('birthYear'), value: player.birthYear }] : []),
    { label: t('nationality'), value: player.nationality },
    ...(player.joinedYear ? [{ label: t('joined'), value: player.joinedYear }] : []),
    ...(player.heightCm ? [{ label: t('height'), value: `${player.heightCm} cm` }] : []),
    ...(player.weightKg ? [{ label: t('weight'), value: `${player.weightKg} kg` }] : []),
    ...(player.club ? [{ label: t('club'), value: player.club }] : []),
  ]

  const stat = (value: number, label: string) => (
    <div className="text-center md:text-left">
      <div className="font-heading font-extrabold text-[40px] md:text-[56px] leading-none tabular" style={{ color: 'var(--yellow)' }}>{value}</div>
      <div className="text-[12px] uppercase tracking-[0.06em] text-text-muted mt-1">{label}</div>
    </div>
  )

  return (
    <div className="pb-16">
      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: routes.home(locale) },
            { label: team?.name ?? tt('title'), href: team ? routes.team(locale, team.slug) : routes.teams(locale) },
            { label: player.lastName },
          ]}
        />
      </div>

      {/* Split hero */}
      <section className="container-page mt-4">
        <div className="grid md:grid-cols-[440px_1fr] gap-6 md:gap-10 items-end rounded-card border border-line overflow-hidden" style={{ background: 'var(--surface-raised)' }}>
          <div className="relative min-h-[360px] md:min-h-[460px] flex items-end justify-center">
            <div className="absolute inset-0 grid place-items-center">
              <GhostNumber number={player.number} size={280} glow={!hasPortrait} />
            </div>
            {hasPortrait ? (
              <ImageSlot image={player.portrait} rounded={false} className="relative h-full max-h-[460px]" />
            ) : (
              <span className="sr-only">Kein Porträt vorhanden</span>
            )}
          </div>

          <div className="p-6 md:py-10 md:pr-10">
            <div className="text-[18px] text-text-muted">{player.firstName}</div>
            <h1 className="font-heading font-bold uppercase text-[44px] leading-[44px] md:text-[88px] md:leading-[82px]" style={{ letterSpacing: '-0.02em' }}>
              {player.lastName}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge kind="number">#{player.number}</Badge>
              <span className="rounded-pill border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-text-muted">{tp(player.position)}</span>
              {player.captain && <Badge kind="role">{t('captain')}</Badge>}
              {isAlumni && <span className="rounded-pill border border-line px-2.5 py-1 text-[11px] font-semibold uppercase text-text-muted">{t('former')}</span>}
            </div>
            <div className="mt-6 flex gap-8">
              {stat(player.stats.caps, t('caps'))}
              {stat(player.stats.goals, t('goals'))}
              {stat(player.stats.assists, t('assists'))}
            </div>
          </div>
        </div>
      </section>

      {/* Bio + Steckbrief */}
      <section className="container-page mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          {hasBio ? (
            <div className="prose-measure">
              <p className="text-[17px] leading-7 md:text-[18px] md:leading-[30px]">{player.bio}</p>
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-line p-8">
              <h2 className="font-heading font-bold uppercase text-[20px]">{t('noBioTitle')}</h2>
              <p className="mt-2 text-text-muted">{t('noBioBody', { name: `${player.firstName} ${player.lastName}` })}</p>
            </div>
          )}
        </div>
        <KeyValuePanel title={t('steckbrief')} rows={steckbrief} />
      </section>

      {/* Recent games */}
      {appearances.length > 0 && (
        <section className="container-page mt-12">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('lastGames')}</h2>
          <div className="rounded-card border border-line overflow-hidden">
            {appearances.map((g) => (
              <FixtureRow key={g.id} game={g} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* More players */}
      {related.length > 0 && (
        <section className="container-page mt-12">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('morePlayers')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <PlayerCard key={p.id} player={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
