'use client'

import { useState } from 'react'

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  function toggle() {
    setIsLight(prev => {
      const next = !prev
      document.documentElement.setAttribute('data-theme', next ? 'light' : '')
      return next
    })
  }

  return (
    <button className="theme-btn" onClick={toggle}>
      {isLight ? 'dark' : 'light'}
    </button>
  )
}
