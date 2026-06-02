export function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12.5" stroke="var(--border2)" strokeWidth="1" />
      {/* North — accent */}
      <path d="M14 3 L16 12 L14 14 L12 12 Z" fill="var(--acc)" />
      {/* South */}
      <path d="M14 25 L12 16 L14 14 L16 16 Z" fill="var(--text3)" />
      {/* East */}
      <path d="M25 14 L16 12 L14 14 L16 16 Z" fill="var(--text2)" />
      {/* West */}
      <path d="M3 14 L12 16 L14 14 L12 12 Z" fill="var(--text2)" />
      <circle cx="14" cy="14" r="1.5" fill="var(--bg2)" />
      <circle cx="14" cy="14" r="0.6" fill="var(--acc)" />
    </svg>
  )
}
