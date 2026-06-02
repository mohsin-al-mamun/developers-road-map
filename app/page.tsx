import Link from 'next/link'
import { NAV_SECTIONS, PHASE_META, TOPICS } from './_data/roadmap-data'

export default function Home() {
  return (
    <div className="home-view">
      <div className="home-container">

        {/* Hero */}
        <div className="home-hero">
          <div className="home-eyebrow">Senior Developer Roadmap · 2025</div>
          <h1 className="home-title">
            Everything you need<br />to reach <em>senior level</em>.
          </h1>
          <p className="home-desc">
            A complete, ordered guide covering React, Next.js, Node.js, TypeScript, DSA,
            system design, databases, AI integration, and security. No fluff — only what
            matters for interviews and real production work.
          </p>
        </div>

        {/* Stats */}
        <div className="home-stats">
          {[
            { val: '12',   label: 'topics' },
            { val: '154',  label: 'subtopics' },
            { val: '3',    label: 'phases' },
            { val: '~320', label: 'study hours' },
            { val: '6–7',  label: 'months' },
          ].map(s => (
            <div key={s.label} className="stat">
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Phase cards */}
        <div className="home-phases">
          <div className="home-phases-title">Three phases to senior level</div>
          <div className="phases-grid">
            {NAV_SECTIONS.map(sec => {
              const pm = PHASE_META[sec.phase]
              return (
                <div key={sec.phase} className="phase-card">
                  <div className="phase-card-header">
                    <span className={`phase-badge ${sec.phase}`}>{pm.label}</span>
                    <span className="phase-card-title">{pm.title}</span>
                  </div>
                  <div className="phase-card-meta">{pm.weeks} · {pm.hours}</div>
                  <div className="phase-topics-row">
                    {sec.keys.map(key => (
                      <Link key={key} href={`/${key}`} className="phase-topic-chip">
                        {TOPICS[key].title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Study loop */}
        <div className="study-loop-box">
          <div className="loop-title">Study loop — use for every topic</div>
          <div className="loop-steps">
            {[
              { n: '01', title: 'Read official docs',   desc: 'Build the correct mental model first. Docs give you the right terminology and edge cases.' },
              { n: '02', title: 'Talk to Claude',       desc: 'Ask for explanations, clarify confusion, get analogies. Use the prompt in each card.' },
              { n: '03', title: 'Build a mini project', desc: 'Prove your understanding with working code. Seeing it run makes it stick.' },
              { n: '04', title: 'Mock interview',       desc: 'Ask Claude to quiz you. Can you explain it without notes? That is the bar.' },
            ].map(step => (
              <div key={step.n} className="loop-step">
                <div className="loop-num">{step.n}</div>
                <div className="loop-step-title">{step.title}</div>
                <div className="loop-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
