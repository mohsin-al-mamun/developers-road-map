'use client'

import { useState } from 'react'
import type { Subtopic } from '@/app/_data/roadmap-data'
import { CopyButton } from './CopyButton'

export function SubtopicCard({ subtopic, index }: { subtopic: Subtopic; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`subtopic-card${open ? ' open' : ''}`}>
      <div className="subtopic-header" onClick={() => setOpen(o => !o)}>
        <div className="subtopic-title-row">
          <span className="subtopic-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="subtopic-title">{subtopic.title}</span>
        </div>
        <span className="subtopic-toggle">{open ? '−' : '+'}</span>
      </div>
      <div className="subtopic-body">
        <p className="subtopic-what">{subtopic.what}</p>
        <div className="points-label">Key points</div>
        <ul className="points-list">
          {subtopic.points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        {subtopic.docs.length > 0 && (
          <div className="subtopic-docs">
            {subtopic.docs.map((d, i) => (
              <a key={i} href={d.url} className="subtopic-doc-link" target="_blank" rel="noopener noreferrer">
                {d.label}
              </a>
            ))}
          </div>
        )}
        {subtopic.prompt && (
          <div className="prompt-box">
            <div className="prompt-label">Claude prompt</div>
            <div className="prompt-text">{subtopic.prompt}</div>
            <CopyButton text={subtopic.prompt} />
          </div>
        )}
      </div>
    </div>
  )
}
