'use client'

import { useState } from 'react'
import type { Level } from '@/app/_data/roadmap-data'
import { SubtopicCard } from './SubtopicCard'

export function LevelTabs({ levels }: { levels: [string, Level][] }) {
  const [active, setActive] = useState(0)

  return (
    <>
      <div className="level-tabs">
        {levels.map(([lk, lv], i) => (
          <div
            key={lk}
            className={`level-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {lv.label}
          </div>
        ))}
      </div>

      {levels.map(([lk, lv], i) => (
        <div key={lk} className={`level-content${i === active ? ' active' : ''}`}>
          <div className="level-desc">{lv.desc}</div>
          <div className="subtopic-list">
            {lv.subtopics.map((sub, si) => (
              <SubtopicCard key={si} subtopic={sub} index={si} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
