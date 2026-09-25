'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';

type Selection = { odds?: number };

export default function CouponBar() {
  const [count, setCount] = useState(0);
  const [odds, setOdds] = useState(0);
  const refresh = () => {
    try {
      const raw = localStorage.getItem('goalix_selections');
      const items: Selection[] = raw ? JSON.parse(raw) : [];
      setCount(Array.isArray(items) ? items.length : 0);
      setOdds(Array.isArray(items) && items.length ? items.reduce((t, item) => t * Number(item.odds || 1), 1) : 0);
    } catch { setCount(0); setOdds(0); }
  };
  useEffect(() => { refresh(); window.addEventListener('goalix:coupon-updated', refresh); window.addEventListener('storage', refresh); return () => { window.removeEventListener('goalix:coupon-updated', refresh); window.removeEventListener('storage', refresh); }; }, []);
  if (!count) return null;
  return <div className="coupon-bar-wrap"><Link href="/bets" className="coupon-bar"><div className="coupon-bar-icon"><Icon name="ticket" size={21}/></div><div className="coupon-bar-copy"><strong>Votre coupon est prêt</strong><span>{count} sélection{count > 1 ? 's' : ''} · Cote totale <b>{odds.toFixed(2)}</b></span></div><span className="coupon-bar-cta">Voir <Icon name="chevron" size={17}/></span></Link><p className="coupon-bar-note">✓ Vérifiez vos choix avant de continuer</p></div>;
}
