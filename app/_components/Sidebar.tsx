'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV_SECTIONS, TOPICS } from '@/app/_data/roadmap-data'
import { ThemeToggle } from './ThemeToggle'

function getPhaseForKey(key: string): string | null {
  for (const sec of NAV_SECTIONS) {
    if (sec.keys.includes(key)) return sec.phase
  }
  return null
}

export function Sidebar() {
  const pathname = usePathname()
  const currentKey = pathname === '/' ? 'home' : pathname.slice(1)

  const [openPhase, setOpenPhase] = useState<string | null>(() => {
    const phase = getPhaseForKey(currentKey)
    return phase ?? 'p1'
  })

  useEffect(() => {
    const phase = getPhaseForKey(currentKey)
    if (phase) setOpenPhase(phase)
  }, [currentKey])

  function togglePhase(phase: string) {
    setOpenPhase(prev => (prev === phase ? null : phase))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">DevMap</div>
        <div className="logo-sub">Senior Engineer Roadmap</div>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/"
          id="nav-home"
          className={`nav-item${currentKey === 'home' ? ' active' : ''}`}
        >
          <span className="nav-dot" />
          <span className="nav-label">Home</span>
        </Link>

        {NAV_SECTIONS.map(sec => (
          <div key={sec.phase} className="phase-group">
            <div
              className={`phase-row${openPhase === sec.phase ? ' open' : ''}`}
              onClick={() => togglePhase(sec.phase)}
            >
              <span className={`phase-indicator ${sec.phase}`} />
              <span className="phase-row-label">{sec.label}</span>
              <span className="phase-row-chevron">›</span>
            </div>

            <div className={`phase-topics${openPhase === sec.phase ? ' open' : ''}`}>
              {sec.keys.map(key => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className={`nav-item${currentKey === key ? ' active' : ''}`}
                >
                  <span className="nav-topic-dash" />
                  <span className="nav-label">{TOPICS[key].title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>5–6 months</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
