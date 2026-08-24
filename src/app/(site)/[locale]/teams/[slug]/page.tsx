import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Position } from '@/lib/data/types'
import { getTeam, getTeams, getSquad, getSquadCounts, getStaff } from '@/lib/data'
import { SquadFilter } from '@/components/sport/SquadFilter'
import { PlayerCard } from '@/components/sport/PlayerCard'
import { ImageSlot } from '@/components/sport/ImageSlot'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const team = await getTeam(slug)
  const t = await getTranslations({ locale, namespace: 'screens.teams' })
  return { title: team ? `${team.name} – ${t('squadOf')}` : t('title') }
}

type Search = { position?: string; q?: string }

export default async function SquadPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<Search>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const team = await getTeam(slug)
  if (!team) notFound()

  const t = await getTranslations({ locale, namespace: 'screens.teams' })
  const position = (sp.position as Position | undefined) ?? 'ALL'
  const query = sp.q ?? ''

  const [teams, players, counts, staff] = await Promise.all([
    getTeams(),
    getSquad(slug, { position, q: query }),
    getSquadCounts(slug),
    getStaff(slug),
  ])

  return (
    <div className="pb-16">
      {/* Compact hero */}
      <section className="border-b border-line" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs items={[{ label: 'Home', href: routes.home(locale) }, { label: t('title'), href: routes.teams(locale) }, { label: team.name }]} className="mb-4" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-body font-semibold uppercase text-[13px] tracking-[0.08em]" style={{ color: 'var(--label-yellow-text)' }}>{t('season')}</p>
              <h1 className="mt-2 font-heading font-bold uppercase text-[32px] leading-9 md:text-[56px] md:leading-[60px]">{team.name}</h1>
            </div>
            <div className="text-[14px] text-text-muted">
              {t('players', { count: counts.ALL })}
              {team.coach && <> · {t('coach')}: <span className="text-text">{team.coach}</span></>}
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="container-page py-6">
        <SquadFilter teams={teams} activeTeam={slug} activePosition={position} query={query} counts={counts} locale={locale} />
      </div>

      {/* Grid or zero-results */}
      <div className="container-page">
        {players.length === 0 ? (
          <div className="rounded-card border border-dashed border-line p-10 text-center">
            <h2 className="font-heading font-bold uppercase text-[24px]">{t('zeroTitle')}</h2>
            <p className="mt-2 text-text-muted">{t('zeroBody')}</p>
            <div className="mt-5 flex justify-center">
              <Button href={routes.team(locale, slug)} variant="secondary">{t('reset')}</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} locale={locale} />
            ))}
          </div>
        )}
      </div>

      {/* Staff */}
      {staff.length > 0 && (
        <div className="container-page mt-12">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px] mb-4">{t('staff')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {staff.map((s) => (
              <div key={s.id} className="rounded-card border border-line bg-surface overflow-hidden">
                <ImageSlot image={s.portrait ?? { label: 'Porträt 3:4', ratio: '3/4' }} rounded={false} />
                <div className="p-4">
                  <div className="font-heading font-bold uppercase text-[20px] leading-6">{s.name}</div>
                  <div className="text-[13px] text-text-muted">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA banner */}
      <div className="container-page mt-16">
        <div className="rounded-card border border-line p-8 text-center" style={{ background: 'var(--surface-raised)' }}>
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px]">{t('ctaTitle')}</h2>
          <p className="mt-3 text-text-muted max-w-xl mx-auto">{t('ctaBody')}</p>
          <div className="mt-6 flex justify-center">
            <Button href={locale === 'de' ? '/kontakt' : '/en/kontakt'}>{t('ctaButton')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
