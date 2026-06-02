'use client'

import { useState } from 'react'
import type { Subtopic } from '@/app/_data/roadmap-data'
import { CopyButton } from './CopyButton'

function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  async function copy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy}>
      {copied ? 'copied!' : 'copy'}
    </button>
  )
}

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

        {/* Key points */}
        <div className="points-label">Key points</div>
        <ul className="points-list">
          {subtopic.points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        {/* Gotchas */}
        {subtopic.gotchas && subtopic.gotchas.length > 0 && (
          <>
            <div className="points-label gotchas-label">Common gotchas</div>
            <ul className="points-list gotchas-list">
              {subtopic.gotchas.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </>
        )}

        {/* Examples */}
        {subtopic.examples && subtopic.examples.length > 0 && (
          <div className="examples-list">
            {subtopic.examples.map((ex, i) => (
              <div key={i} className="example-block">
                <div className="example-label">{ex.label}</div>
                <div className="example-code-wrap">
                  <pre className="example-code"><code>{ex.code}</code></pre>
                  <CodeCopyButton code={ex.code} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subtopic doc links */}
        {subtopic.docs.length > 0 && (
          <div className="subtopic-docs">
            {subtopic.docs.map((d, i) => (
              <a key={i} href={d.url} className="subtopic-doc-link" target="_blank" rel="noopener noreferrer">
                {d.label}
              </a>
            ))}
          </div>
        )}

        {/* Prompt */}
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
