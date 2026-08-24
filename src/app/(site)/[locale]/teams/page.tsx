import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getTeams, getSquadCounts } from '@/lib/data'
import { CrestCircle } from '@/components/sport/CrestCircle'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { routes } from '@/lib/routes'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'screens.teams' })
  return { title: t('title') }
}

export default async function TeamsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'screens.teams' })
  const teams = await getTeams()
  const counts = await Promise.all(teams.map((tm) => getSquadCounts(tm.slug)))

  return (
    <div className="pb-16">
      <section className="border-b border-line" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: routes.home(locale) }, { label: t('title') }]} className="mb-4" />
          <p className="font-body font-semibold uppercase text-[13px] tracking-[0.08em]" style={{ color: 'var(--label-yellow-text)' }}>{t('kicker')}</p>
          <h1 className="mt-2 font-heading font-bold uppercase text-[32px] leading-9 md:text-[56px] md:leading-[60px]">{t('title')}</h1>
        </div>
      </section>

      <div className="container-page py-8 grid gap-4 md:grid-cols-3">
        {teams.map((team, i) => (
          <a key={team.slug} href={routes.team(locale, team.slug)} className="group rounded-card border border-line bg-surface p-5 hover:bg-surface-raised transition-colors" style={{ borderTop: `3px solid ${team.accent ?? 'var(--line)'}`, borderRadius: '0 0 12px 12px' }}>
            <div className="flex items-center gap-3">
              <CrestCircle code={team.crestCode} accent={team.accent} size={48} />
              <div>
                <h2 className="font-heading font-bold uppercase text-[24px] leading-6 group-hover:text-red transition-colors">{team.name}</h2>
                <p className="text-[13px] text-text-muted">{t('players', { count: counts[i].ALL })}{team.ageGroup ? ` · ${team.ageGroup}` : ''}</p>
              </div>
            </div>
            {team.description && <p className="mt-4 text-[15px] leading-6 text-text-muted">{team.description}</p>}
            {team.coach && <p className="mt-3 text-[13px] text-text-muted">{t('coach')}: <span className="text-text">{team.coach}</span></p>}
          </a>
        ))}
      </div>
    </div>
  )
}
