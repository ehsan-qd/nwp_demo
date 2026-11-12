import type { CSSProperties } from 'react'

const paths: Record<string, string> = {
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
  clock: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  car: 'm5 7 2-4h10l2 4m-14 0h14l2 4v7H3v-7l2-4Zm1 7h2m8 0h2M5 18v3m14-3v3',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  chevron: 'm9 5 7 7-7 7',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  play: 'm8 4 12 8-12 8V4Z',
  pause: 'M8 4v16M16 4v16',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
  layers: 'm12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6',
  pin: 'M18 9c0 5-6 12-6 12S6 14 6 9a6 6 0 1 1 12 0Zm-4 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  bolt: 'm13 2-9 12h7l-1 8 10-12h-7l0-8Z',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5V10Zm7 4v3',
  close: 'm6 6 12 12M6 18 18 6',
  info: 'M12 11v6m0-10h.01m9 5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  shield: 'm12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5l8-3Zm-4 9 3 3 5-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
}

export default function Icon({ name, size = 18, style }: { name: string; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name] ?? paths.info} /></svg>
}
