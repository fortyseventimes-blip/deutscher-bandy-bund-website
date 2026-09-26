/**
 * Run report for the one-off imports. Every assumption or problem is listed
 * for a human instead of being silently resolved (openspec/specs/team-roster
 * "report every ambiguous row instead of guessing").
 */
export type ReportLevel = 'error' | 'review' | 'created' | 'updated' | 'info'

type Entry = { level: ReportLevel; subject: string; message: string }

const HEADINGS: Record<ReportLevel, string> = {
  error: 'Skipped — needs fixing',
  review: 'Imported — please check',
  created: 'Created (as draft)',
  updated: 'Updated (new draft version)',
  info: 'Notes',
}

export class ImportReport {
  private entries: Entry[] = []
  private headings: Record<ReportLevel, string>

  /** `headings` renames sections for imports that e.g. never create drafts. */
  constructor(headings: Partial<Record<ReportLevel, string>> = {}) {
    this.headings = { ...HEADINGS, ...headings }
  }

  add(level: ReportLevel, subject: string, message = '') {
    this.entries.push({ level, subject, message })
  }

  count(level: ReportLevel) {
    return this.entries.filter((e) => e.level === level).length
  }

  toMarkdown(title: string): string {
    const lines = [`# ${title}`, '']
    for (const level of Object.keys(this.headings) as ReportLevel[]) {
      const rows = this.entries.filter((e) => e.level === level)
      if (rows.length === 0) continue
      lines.push(`## ${this.headings[level]} (${rows.length})`, '')
      for (const r of rows) lines.push(`- **${r.subject}**${r.message ? ` — ${r.message}` : ''}`)
      lines.push('')
    }
    if (this.entries.length === 0) lines.push('Nothing to import.')
    return lines.join('\n')
  }
}
