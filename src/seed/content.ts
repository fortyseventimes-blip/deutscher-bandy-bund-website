import { lexical, p, h2 } from './lexical'

/**
 * Seed content for the foundation: the header/footer navigation trees and the
 * three legally-required pages. German is authored; English is the derived
 * translation. Impressum register data is marked [[TBD — board]] and must be
 * confirmed before launch (see openspec proposal "Decisions still needed").
 */

export const headerNav = {
  de: [
    { label: 'Spielplan', href: '/spiele' },
    { label: 'Teams', href: '/teams' },
    { label: 'News', href: '/news' },
    { label: 'Turniere', href: '/turniere' },
    { label: 'Verband', href: '/verband' },
  ],
  en: [
    { label: 'Fixtures & Results', href: '/en/games' },
    { label: 'Teams', href: '/en/teams' },
    { label: 'News', href: '/en/news' },
    { label: 'Tournaments', href: '/en/tournaments' },
    { label: 'Federation', href: '/en/federation' },
  ],
}

export const headerCta = {
  de: { label: 'Newsletter abonnieren', href: '/newsletter' },
  en: { label: 'Subscribe to newsletter', href: '/en/newsletter' },
}

type LegalPage = {
  slug: { de: string; en: string }
  title: { de: string; en: string }
  kicker: { de: string; en: string }
  lead: { de: string; en: string }
  body: { de: ReturnType<typeof lexical>; en: ReturnType<typeof lexical> }
}

export const legalPages: LegalPage[] = [
  {
    slug: { de: 'impressum', en: 'imprint' },
    title: { de: 'Impressum', en: 'Imprint' },
    kicker: { de: 'Rechtliches', en: 'Legal' },
    lead: {
      de: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).',
      en: 'Information pursuant to § 5 of the German Digital Services Act (DDG).',
    },
    body: {
      de: lexical([
        h2('Anbieter'),
        p('Deutscher Bandy-Bund e. V.'),
        p('[[TBD — Vorstand: Anschrift]]'),
        p('Vereinsregister: [[TBD — Registernummer]], Registergericht: [[TBD — Amtsgericht]]'),
        h2('Vertretungsberechtigter Vorstand'),
        p('[[TBD — Vorstand: Namen der vertretungsberechtigten Personen]]'),
        h2('Kontakt'),
        p('E-Mail: info@bandy-bund.de'),
        h2('Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV'),
        p('[[TBD — Name und Anschrift der verantwortlichen Person]]'),
      ]),
      en: lexical([
        h2('Provider'),
        p('Deutscher Bandy-Bund e. V.'),
        p('[[TBD — board: postal address]]'),
        p('Register of associations: [[TBD — register number]], Registry court: [[TBD — local court]]'),
        h2('Authorised board'),
        p('[[TBD — board: names of the authorised representatives]]'),
        h2('Contact'),
        p('Email: info@bandy-bund.de'),
        h2('Responsible for content pursuant to § 18 (2) MStV'),
        p('[[TBD — name and address of the responsible person]]'),
      ]),
    },
  },
  {
    slug: { de: 'datenschutz', en: 'privacy' },
    title: { de: 'Datenschutzerklärung', en: 'Privacy Policy' },
    kicker: { de: 'Rechtliches', en: 'Legal' },
    lead: {
      de: 'Wie wir mit personenbezogenen Daten umgehen.',
      en: 'How we handle personal data.',
    },
    body: {
      de: lexical([
        h2('Verantwortliche Stelle'),
        p('Verantwortlich für die Datenverarbeitung auf dieser Website ist der Deutsche Bandy-Bund e. V.'),
        h2('Analyse und Reichweitenmessung'),
        p('Diese Website nutzt eine cookielose, IP-anonymisierende Reichweitenmessung. Es werden keine geräteübergreifenden Kennungen gesetzt.'),
        h2('Einbettungen von Drittanbietern'),
        p('Inhalte Dritter (z. B. Karten oder Videos) werden erst nach Ihrer ausdrücklichen Einwilligung geladen. Ihre Einwilligung können Sie jederzeit über „Cookie-Einstellungen" in der Fußzeile widerrufen.'),
        p('[[TBD — vollständige Datenschutzerklärung durch den Vorstand / Rechtsberatung]]'),
      ]),
      en: lexical([
        h2('Controller'),
        p('The controller for data processing on this website is Deutscher Bandy-Bund e. V.'),
        h2('Analytics'),
        p('This website uses cookieless, IP-anonymising analytics. No cross-device identifiers are set.'),
        h2('Third-party embeds'),
        p('Third-party content (e.g. maps or videos) is loaded only after your explicit consent. You can withdraw your consent at any time via "Cookie settings" in the footer.'),
        p('[[TBD — full privacy policy to be provided by the board / legal counsel]]'),
      ]),
    },
  },
  {
    slug: { de: 'barrierefreiheit', en: 'accessibility' },
    title: { de: 'Barrierefreiheitserklärung', en: 'Accessibility Statement' },
    kicker: { de: 'Rechtliches', en: 'Legal' },
    lead: {
      de: 'Unser Anspruch an eine zugängliche Website.',
      en: 'Our commitment to an accessible website.',
    },
    body: {
      de: lexical([
        h2('Stand der Barrierefreiheit'),
        p('Wir sind bestrebt, diese Website im Einklang mit WCAG 2.2 AA barrierefrei zugänglich zu machen.'),
        h2('Feedback und Kontakt'),
        p('Sind Ihnen Barrieren aufgefallen? Schreiben Sie uns an info@bandy-bund.de.'),
        p('[[TBD — vollständige Erklärung inkl. Bewertungsverfahren]]'),
      ]),
      en: lexical([
        h2('Accessibility status'),
        p('We strive to make this website accessible in line with WCAG 2.2 AA.'),
        h2('Feedback and contact'),
        p('Did you encounter a barrier? Write to us at info@bandy-bund.de.'),
        p('[[TBD — full statement including the assessment procedure]]'),
      ]),
    },
  },
]
