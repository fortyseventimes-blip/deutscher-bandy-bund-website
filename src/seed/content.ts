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
    { label: 'Fixtures & Results', href: '/en/spiele' },
    { label: 'Teams', href: '/en/teams' },
    { label: 'News', href: '/en/news' },
    { label: 'Tournaments', href: '/en/turniere' },
    { label: 'Federation', href: '/en/verband' },
  ],
}

export const headerCta = {
  de: { label: 'Newsletter abonnieren', href: '/newsletter' },
  en: { label: 'Subscribe to newsletter', href: '/en/newsletter' },
}

type StaticPage = {
  slug: { de: string; en: string }
  title: { de: string; en: string }
  kicker: { de: string; en: string }
  lead: { de: string; en: string }
  body: { de: ReturnType<typeof lexical>; en: ReturnType<typeof lexical> }
}

export const legalPages: StaticPage[] = [
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

/**
 * The remaining pages the navigation links to. Without these the header/footer
 * entries 404. German is the authored source, English the derived translation;
 * facts the board still has to confirm are marked [[TBD]] rather than invented.
 */
export const infoPages: StaticPage[] = [
  {
    slug: { de: 'verband', en: 'federation' },
    title: { de: 'Verband', en: 'Federation' },
    kicker: { de: 'Über uns', en: 'About us' },
    lead: {
      de: 'Der Deutsche Bandy-Bund e. V. ist der nationale Verband für Bandy und Rinkbandy in Deutschland.',
      en: 'Deutscher Bandy-Bund e. V. is the national governing body for bandy and rink bandy in Germany.',
    },
    body: {
      de: lexical([
        h2('Auftrag'),
        p('Der Deutsche Bandy-Bund vertritt Bandy und Rinkbandy in Deutschland: Er stellt die Nationalmannschaften, organisiert den nationalen Spielbetrieb und vertritt Deutschland in der Federation of International Bandy (FIB).'),
        h2('Der Sport'),
        p('Bandy wird mit elf Spielerinnen und Spielern je Team auf einer fußballfeldgroßen Eisfläche gespielt — mit Schlägern, einem Ball und zwei Halbzeiten à 45 Minuten. Rinkbandy ist die kleinere Variante mit sechs Feldspielern auf einer Eishockeyfläche.'),
        h2('Mannschaften'),
        p('Der Verband stellt eine Herren- und eine Damen-Auswahl; der Aufbau eines Nachwuchskaders läuft.'),
        h2('Gegründet'),
        p('Der Deutsche Bandy-Bund e. V. wurde im Juni 2013 gegründet und hat seinen Sitz in Frankfurt am Main.'),
        h2('Vorstand'),
        p('[[TBD — Vorstand: aktuelle Besetzung durch den Verband bestätigen]]'),
      ]),
      en: lexical([
        h2('Mission'),
        p('The German Bandy Federation represents bandy and rink bandy in Germany: it fields the national teams, organises national competition and represents Germany in the Federation of International Bandy (FIB).'),
        h2('The sport'),
        p('Bandy is played eleven-a-side on a football-pitch-sized sheet of ice — with sticks, a ball and two halves of 45 minutes. Rink bandy is the smaller variant, six outfield players on an ice-hockey rink.'),
        h2('Teams'),
        p('The federation fields a men’s and a women’s squad; a youth squad is being built up.'),
        h2('Founded'),
        p('Deutscher Bandy-Bund e. V. was founded in June 2013 and is seated in Frankfurt am Main.'),
        h2('Board'),
        p('[[TBD — board: current composition to be confirmed by the federation]]'),
      ]),
    },
  },
  {
    slug: { de: 'kontakt', en: 'contact' },
    title: { de: 'Kontakt', en: 'Contact' },
    kicker: { de: 'Verband', en: 'Federation' },
    lead: {
      de: 'Fragen zum Verband, zur Mannschaft oder zum Sport? Schreiben Sie uns.',
      en: 'Questions about the federation, the squads or the sport? Get in touch.',
    },
    body: {
      de: lexical([
        h2('Allgemeine Anfragen'),
        p('E-Mail: info@bandy-bund.de'),
        h2('Presse'),
        p('Für Interviewanfragen, Akkreditierungen und Bildmaterial: presse@bandy-bund.de'),
        h2('Mitspielen'),
        p('Sie möchten Bandy ausprobieren? Schreiben Sie an info@bandy-bund.de — wir vermitteln den Kontakt zum nächstgelegenen Verein.'),
        h2('Anschrift'),
        p('Deutscher Bandy-Bund e. V., [[TBD — Anschrift durch den Vorstand bestätigen]]'),
        p('Ein Kontaktformular folgt in Kürze.'),
      ]),
      en: lexical([
        h2('General enquiries'),
        p('Email: info@bandy-bund.de'),
        h2('Press'),
        p('For interview requests, accreditation and imagery: presse@bandy-bund.de'),
        h2('Want to play?'),
        p('Curious about bandy? Write to info@bandy-bund.de — we will put you in touch with the nearest club.'),
        h2('Postal address'),
        p('Deutscher Bandy-Bund e. V., [[TBD — address to be confirmed by the board]]'),
        p('A contact form will follow shortly.'),
      ]),
    },
  },
  {
    slug: { de: 'mitgliedschaft', en: 'membership' },
    title: { de: 'Mitgliedschaft', en: 'Membership' },
    kicker: { de: 'Mitmachen', en: 'Get involved' },
    lead: {
      de: 'Als Verein, als Spielerin oder Spieler, als Unterstützer — es gibt viele Wege, Teil des Bandy-Bundes zu werden.',
      en: 'As a club, as a player, as a supporter — there are many ways to become part of the federation.',
    },
    body: {
      de: lexical([
        h2('Für Vereine'),
        p('Vereine, die Bandy oder Rinkbandy anbieten möchten, können die Mitgliedschaft im Deutschen Bandy-Bund beantragen. Wir unterstützen beim Aufbau, bei Ausrüstung und Spielbetrieb.'),
        h2('Für Spielerinnen und Spieler'),
        p('Erfahrung im Eishockey, Feldhockey oder Fußball hilft — Voraussetzung ist sie nicht. Wer Schlittschuh laufen kann, kann Bandy lernen. Melden Sie sich für ein Probetraining.'),
        h2('Für Unterstützer und Partner'),
        p('Der Verband arbeitet ehrenamtlich. Partnerschaften und Sponsoring machen Lehrgänge, Reisen und Ausrüstung erst möglich.'),
        h2('Beiträge'),
        p('[[TBD — Beitragsordnung durch den Vorstand bestätigen]]'),
        h2('Kontakt'),
        p('Schreiben Sie an info@bandy-bund.de.'),
      ]),
      en: lexical([
        h2('For clubs'),
        p('Clubs wishing to offer bandy or rink bandy can apply for membership in the federation. We help with setup, equipment and competition.'),
        h2('For players'),
        p('Experience in ice hockey, field hockey or football helps — but it is not a requirement. If you can skate, you can learn bandy. Get in touch for a trial session.'),
        h2('For supporters and partners'),
        p('The federation is run by volunteers. Partnerships and sponsorship are what make training camps, travel and equipment possible.'),
        h2('Fees'),
        p('[[TBD — fee schedule to be confirmed by the board]]'),
        h2('Contact'),
        p('Write to info@bandy-bund.de.'),
      ]),
    },
  },
  {
    slug: { de: 'news', en: 'news' },
    title: { de: 'News', en: 'News' },
    kicker: { de: 'Aktuelles', en: 'Latest' },
    lead: {
      de: 'Neuigkeiten aus dem Verband, von den Mannschaften und aus dem Spielbetrieb.',
      en: 'News from the federation, the squads and the competition.',
    },
    body: {
      de: lexical([
        p('Der Newsbereich wird derzeit aufgebaut. Bis dahin finden Sie die aktuellen Meldungen auf der Startseite.'),
        h2('Newsletter'),
        p('Wer nichts verpassen möchte, abonniert den Newsletter des Deutschen Bandy-Bundes — Spielankündigungen, Ergebnisse und Neuigkeiten direkt ins Postfach.'),
      ]),
      en: lexical([
        p('The news section is being built. Until then you will find the latest items on the home page.'),
        h2('Newsletter'),
        p('To keep up, subscribe to the federation newsletter — match announcements, results and news straight to your inbox.'),
      ]),
    },
  },
  {
    slug: { de: 'galerie', en: 'gallery' },
    title: { de: 'Galerie', en: 'Gallery' },
    kicker: { de: 'Medien', en: 'Media' },
    lead: {
      de: 'Bilder von Spielen, Lehrgängen und Turnieren.',
      en: 'Photos from matches, training camps and tournaments.',
    },
    body: {
      de: lexical([
        p('Die Bildergalerie wird derzeit aufgebaut. Fotos zu einzelnen Spielen finden Sie bereits auf den jeweiligen Spielseiten.'),
        h2('Bildrechte'),
        p('Alle Aufnahmen sind urheberrechtlich geschützt. Presseanfragen zu Bildmaterial: presse@bandy-bund.de.'),
      ]),
      en: lexical([
        p('The photo gallery is being built. Photos for individual matches are already on the respective match pages.'),
        h2('Image rights'),
        p('All images are protected by copyright. Press enquiries about imagery: presse@bandy-bund.de.'),
      ]),
    },
  },
  {
    slug: { de: 'newsletter', en: 'newsletter' },
    title: { de: 'Newsletter', en: 'Newsletter' },
    kicker: { de: 'Service', en: 'Service' },
    lead: {
      de: 'Spielankündigungen, Ergebnisse und Neuigkeiten direkt ins Postfach.',
      en: 'Match announcements, results and news straight to your inbox.',
    },
    body: {
      de: lexical([
        p('Der Newsletter des Deutschen Bandy-Bundes erscheint unregelmäßig — immer dann, wenn es etwas zu berichten gibt: vor Länderspielen, nach Turnieren und bei Neuigkeiten aus dem Verband.'),
        h2('Anmeldung'),
        p('Die Anmeldung erfolgt über das Formular auf der Startseite. Sie erhalten eine Bestätigungsmail; erst nach Ihrer Bestätigung nehmen wir Sie in den Verteiler auf (Double-Opt-in).'),
        h2('Abmeldung'),
        p('Jede Ausgabe enthält einen Abmeldelink. Eine Abmeldung ist jederzeit und ohne Angabe von Gründen möglich.'),
        h2('Datenschutz'),
        p('Wir speichern ausschließlich Ihre E-Mail-Adresse und den Zeitpunkt Ihrer Bestätigung. Details in der Datenschutzerklärung.'),
      ]),
      en: lexical([
        p('The federation newsletter appears irregularly — whenever there is something to report: ahead of internationals, after tournaments and when there is federation news.'),
        h2('Signing up'),
        p('Sign up via the form on the home page. You will receive a confirmation email; only after you confirm do we add you to the list (double opt-in).'),
        h2('Unsubscribing'),
        p('Every issue contains an unsubscribe link. You can unsubscribe at any time, without giving a reason.'),
        h2('Privacy'),
        p('We store only your email address and the time of your confirmation. Details are in the privacy policy.'),
      ]),
    },
  },
]

/** Every editor-owned static page the seed creates. */
export const staticPages: StaticPage[] = [...legalPages, ...infoPages]
