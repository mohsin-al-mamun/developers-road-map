import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { TOPICS } from '@/app/_data/roadmap-data'
import { LevelTabs } from '@/app/_components/LevelTabs'

export function generateStaticParams() {
  return Object.keys(TOPICS).map(key => ({ topic: key }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>
}): Promise<Metadata> {
  const { topic } = await params
  const t = TOPICS[topic]
  if (!t) return {}
  return {
    title: `${t.title} — DevMap`,
    description: t.intro.slice(0, 160),
  }
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const t = TOPICS[topic]
  if (!t) notFound()

  const phaseClass = t.phase.includes('Phase 1')
    ? 'bg-acc'
    : t.phase.includes('Phase 2')
    ? 'bg-sky'
    : 'bg-vi'
  const colorClass = `c-${t.color}`

  const levels = Object.entries(t.levels) as [string, (typeof t.levels)[string]][]

  return (
    <div className="topic-view">
      <div className="topic-header">
        <div className="topic-breadcrumb">
          <Link href="/" className="breadcrumb-home">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <span>{t.title}</span>
        </div>
        <div className={`topic-phase-badge ${phaseClass} ${colorClass}`}>{t.phase}</div>
        <h2 className="topic-title">{t.title}</h2>
        <div className="topic-meta-row">
          <span className="topic-meta">{t.meta}</span>
        </div>
        <p className="topic-intro">{t.intro}</p>
        <div className="doc-note">
          <span className="doc-note-icon">⚠</span>
          <span className="doc-note-text">
            <strong>Read the docs first.</strong> {t.docNote}
          </span>
        </div>
        {t.docs.length > 0 && (
          <div className="doc-links-row">
            {t.docs.map((d, i) => (
              <a key={i} href={d.url} className="doc-link" target="_blank" rel="noopener noreferrer">
                {d.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <LevelTabs levels={levels} />
    </div>
  )
}
