'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_SECTIONS, TOPICS } from '@/app/_data/roadmap-data'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="2" y1="5" x2="18" y2="5" />
      <line x1="2" y1="10" x2="18" y2="10" />
      <line x1="2" y1="15" x2="18" y2="15" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentKey = pathname === '/' ? 'home' : pathname.slice(1)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Sticky top bar */}
      <header className="mobile-header">
        <Link href="/" className="mobile-logo">
          <Logo />
          <span className="logo-text">
            <span className="logo-dev">Dev</span><span className="logo-map">Map</span>
          </span>
        </Link>
        <div className="mobile-header-actions">
          <ThemeToggle />
          <button className="hamburger-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {open ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div className={`drawer-backdrop${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

      {/* Slide-in drawer */}
      <nav className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="drawer-nav">
          <Link href="/" className={`nav-item${currentKey === 'home' ? ' active' : ''}`}>
            <span className="nav-dot" />
            <span className="nav-label">Home</span>
          </Link>

          {NAV_SECTIONS.map(sec => (
            <div key={sec.phase} className="phase-group">
              <div className="phase-row open">
                <span className={`phase-indicator ${sec.phase}`} />
                <span className="phase-row-label">{sec.label}</span>
              </div>
              <div className="phase-topics open">
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
        </div>
      </nav>
    </>
  )
}
