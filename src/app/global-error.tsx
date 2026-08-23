'use client'

/*
 * Global 500 — the last-resort error boundary. It replaces the root layout, so
 * it renders its own <html>/<body> and depends on NOTHING external: no database,
 * no token stylesheet, no fonts (openspec/specs/navigation-static "Error pages":
 * a static 500 with contact info and no stack trace). Bilingual, since we can't
 * know the locale here.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07090b',
          color: '#f4f7f9',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '520px', textAlign: 'center' }}>
          <p style={{ color: '#dd0000', fontWeight: 800, fontSize: '48px', margin: 0 }}>500</p>
          <h1 style={{ fontSize: '28px', margin: '12px 0 0', textTransform: 'uppercase' }}>
            Etwas ist schiefgelaufen
          </h1>
          <p style={{ color: '#98a3ad', lineHeight: 1.6, marginTop: '12px' }}>
            Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.
            <br />
            A technical error occurred. Please try again later.
          </p>
          <p style={{ color: '#98a3ad', fontSize: '14px', marginTop: '16px' }}>
            Kontakt / Contact:{' '}
            <a href="mailto:info@bandy-bund.de" style={{ color: '#ff4d4d' }}>
              info@bandy-bund.de
            </a>
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: '24px',
              minHeight: '44px',
              padding: '0 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#dd0000',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            Erneut versuchen / Try again
          </button>
        </main>
      </body>
    </html>
  )
}
