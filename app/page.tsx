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
          <div className="loop-title">Study loop — repeat for every topic</div>
          <div className="loop-steps">
            {[
              { n: '01', title: 'Read official docs',   desc: 'Build the correct mental model first. Docs give you the right terminology and edge cases.', color: 'var(--acc)'   },
              { n: '02', title: 'Talk to Claude',       desc: 'Ask for explanations, clarify confusion, get analogies. Use the prompt in each card.',      color: 'var(--vi)'    },
              { n: '03', title: 'Build a mini project', desc: 'Prove your understanding with working code. Seeing it run makes it stick.',                  color: 'var(--grn)'   },
              { n: '04', title: 'Mock interview',       desc: 'Ask Claude to quiz you. Can you explain it without notes? That is the bar.',                 color: 'var(--amber)' },
            ].map(step => (
              <div key={step.n} className="loop-step">
                <span className="loop-num" style={{ color: step.color }}>{step.n}</span>
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
