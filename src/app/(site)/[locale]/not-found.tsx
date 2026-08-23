import { getTranslations, getLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { homeHref } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

/*
 * Composed 404 (Komponentenblatt 5e). The foundation offers a clear message,
 * search and a route home; the "latest news / next fixture" panels are wired in
 * once those collections exist (openspec/specs/navigation-static "Error pages").
 */
export default async function NotFound() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()

  return (
    <section className="container-page py-20 md:py-28">
      <p className="font-heading font-extrabold text-red text-[64px] leading-none md:text-[120px] tabular">
        {t('notFound.code')}
      </p>
      <h1 className="mt-4 text-[32px] leading-9 md:text-[56px] md:leading-[60px] font-bold">
        {t('notFound.title')}
      </h1>
      <p className="prose-measure mt-4 text-text-muted text-[17px] leading-7">
        {t('notFound.lead')}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={homeHref(locale)}>{t('notFound.cta')}</Button>
        <Button href={locale === 'de' ? '/suche' : '/en/search'} variant="secondary">
          {t('common.search')}
        </Button>
      </div>
    </section>
  )
}
