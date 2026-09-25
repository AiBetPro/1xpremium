import React from 'react';

type IconName = 'ball' | 'stadium' | 'trophy' | 'chart' | 'live' | 'ai' | 'ticket' | 'user' | 'search' | 'wallet' | 'home' | 'sports' | 'chevron' | 'check' | 'close' | 'share' | 'copy' | 'sparkles';

export function Icon({ name, size = 20, strokeWidth = 2, className = '' }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true };
  switch (name) {
    case 'ball': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m12 3 3 4-1 4h-4L9 7l3-4Zm0 8 4 3-1 5m-3-5-4 3 1 5m-1-8-5-1m13 1 5-1"/></svg>;
    case 'stadium': return <svg {...common}><path d="M4 20V9l8-5 8 5v11"/><path d="M7 20v-7h10v7M3 20h18M9 13v7m6-7v7"/></svg>;
    case 'trophy': return <svg {...common}><path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm-4 1h4v3a4 4 0 0 1-4-3Zm16 0h-4v3a4 4 0 0 0 4-3ZM12 12v5m-4 3h8M9 17h6"/></svg>;
    case 'chart': return <svg {...common}><path d="M4 19V5m0 14h16"/><path d="m7 15 3-4 3 2 5-7"/></svg>;
    case 'live': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg>;
    case 'ai': return <svg {...common}><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 12h.01M15 12h.01M9.5 15a4 4 0 0 0 5 0"/></svg>;
    case 'ticket': return <svg {...common}><path d="M4 7a2 2 0 0 0 0 4 2 2 0 0 0 0 4v2h16v-2a2 2 0 0 0 0-4 2 2 0 0 0 0-4V5H4v2Z"/><path d="M12 7v2m0 3v2m0 3v1"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>;
    case 'search': return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>;
    case 'wallet': return <svg {...common}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"/><path d="M4 8h14a2 2 0 0 1 2 2v3H15a2 2 0 0 1 0-4h5"/></svg>;
    case 'home': return <svg {...common}><path d="m3 11 9-7 9 7v9H5a2 2 0 0 1-2-2v-7Z"/><path d="M9 20v-6h6v6"/></svg>;
    case 'sports': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m12 3 3 5-3 4-5-1-4 1M12 12l4 6M7 11l2 7"/></svg>;
    case 'chevron': return <svg {...common}><path d="m9 18 6-6-6-6"/></svg>;
    case 'check': return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
    case 'close': return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
    case 'share': return <svg {...common}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4m-7.6 7.8 7.6 4.4"/></svg>;
    case 'copy': return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>;
    case 'sparkles': return <svg {...common}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Zm7 11 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/></svg>;
  }
}

export function TeamBadge({ team, size = 'md' }: { team: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = team === 'Atlético Madrid' ? 'AM' : team === 'Real Madrid' ? 'RM' : team.slice(0, 2).toUpperCase();
  return <span className={`team-badge team-badge-${size}`} aria-label={`Logo ${team}`}>{initials}</span>;
}
