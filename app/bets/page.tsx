'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Selection = {
  id: string;
  match: string;
  league: string;
  market: string;
  choice: string;
  odds: number;
  matchId?: string;
};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'GX-';
  for (let i = 0; i < 6; i += 1) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const matchRoutes: Record<string, string> = {
  'PSG vs Lyon': 'psg-lyon',
  'Arsenal vs Chelsea': 'arsenal-chelsea',
  'Barcelona vs Sevilla': 'barcelona-sevilla',
  'Inter vs Milan': 'inter-milan',
  'Real Madrid vs Atlético Madrid': 'real-atletico',
};

export default function BetsPage() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [reservationInput, setReservationInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('goalix_selections');
      const savedStake = localStorage.getItem('goalix_stake');
      const savedCode = localStorage.getItem('goalix_coupon_code');
      const parsed: Selection[] = saved ? JSON.parse(saved) : [];
      setSelections(Array.isArray(parsed) ? parsed : []);
      if (savedStake) setStake(savedStake);
      if (savedCode) setCouponCode(savedCode);
      if (!savedCode && parsed.length > 0) setCouponCode(generateCode());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('goalix_selections', JSON.stringify(selections));
      localStorage.setItem('goalix_stake', stake);
      if (couponCode) localStorage.setItem('goalix_coupon_code', couponCode);
    } catch (error) {
      console.error(error);
    }
  }, [selections, stake, couponCode]);

  useEffect(() => {
    if (!couponCode || selections.length === 0) return;
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, selections, stake }),
    }).catch(() => {
      // Le mode local reste disponible tant que DATABASE_URL n'est pas configuré.
    });
  }, [couponCode, selections, stake]);

  const totalOdds = useMemo(() => selections.reduce((total, item) => total * Number(item.odds || 1), 1), [selections]);
  const potentialWin = useMemo(() => {
    const value = Number(stake);
    return value > 0 && selections.length > 0 ? value * totalOdds : 0;
  }, [stake, selections.length, totalOdds]);

  function removeSelection(id: string) {
    setSelections((current) => current.filter((item) => item.id !== id));
    setMessage('Sélection retirée du coupon.');
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
    setCouponCode('');
    setCopied(false);
    localStorage.removeItem('goalix_selections');
    localStorage.removeItem('goalix_stake');
    localStorage.removeItem('goalix_coupon_code');
    setMessage('Votre coupon a été réinitialisé.');
  }

  async function copyCode() {
    if (!couponCode) return;
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setMessage('Code de réservation copié.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage('Copie indisponible sur cet appareil.');
    }
  }

  async function shareCoupon() {
    if (!couponCode) return;
    const text = `🎟️ Coupon GOALIX\n\nCode de réservation : ${couponCode}\n${selections.length} sélection(s)\nCote totale : ${totalOdds.toFixed(2)}\n\nOuvrez GOALIX pour charger ce coupon.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Coupon GOALIX', text });
      } else {
        await navigator.clipboard.writeText(text);
        setMessage('Message du coupon copié pour être partagé.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') console.error(error);
    }
  }

  async function loadCoupon() {
    const code = reservationInput.trim().toUpperCase();
    if (!code) {
      setMessage('Entrez un code de réservation GOALIX.');
      return;
    }

    setLoadingCoupon(true);
    setMessage('Chargement du coupon…');
    try {
      const response = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Coupon introuvable');
      const loaded = data.coupon;
      const loadedSelections = Array.isArray(loaded.selections) ? loaded.selections : [];
      setSelections(loadedSelections);
      setStake(String(loaded.stake ?? ''));
      setCouponCode(loaded.code);
      localStorage.setItem('goalix_selections', JSON.stringify(loadedSelections));
      localStorage.setItem('goalix_stake', String(loaded.stake ?? ''));
      localStorage.setItem('goalix_coupon_code', loaded.code);
      setReservationInput('');
      setMessage(`Coupon ${loaded.code} chargé avec succès.`);
    } catch (error) {
      const localKey = `goalix_coupon_${code}`;
      const localSaved = localStorage.getItem(localKey);
      if (localSaved) {
        try {
          const local = JSON.parse(localSaved);
          setSelections(Array.isArray(local.selections) ? local.selections : []);
          setStake(String(local.stake ?? ''));
          setCouponCode(code);
          setMessage('Coupon local chargé. Pour le partage entre appareils, la base de données doit être configurée.');
        } catch {
          setMessage('Code de réservation invalide.');
        }
      } else {
        setMessage('Coupon introuvable. Vérifiez le code ou réessayez plus tard.');
      }
    } finally {
      setLoadingCoupon(false);
    }
  }

  function routeFor(item: Selection) {
    if (item.matchId) return item.matchId;
    return matchRoutes[item.match] || 'arsenal-chelsea';
  }

  async function validateBet() {
    const value = Number(stake);
    if (!selections.length) {
      setMessage('Ajoutez au moins une sélection avant de valider.');
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setMessage('Indiquez une mise supérieure à 0 FCFA.');
      return;
    }
    setValidating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setValidating(false);
    localStorage.setItem('goalix_last_bet', JSON.stringify({ code: couponCode, selections, stake: value, totalOdds }));
    setMessage('Pari validé en mode démonstration. Aucun argent réel n\'a été engagé.');
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-28 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3"><span className="text-xl">←</span><span className="text-xl font-black tracking-widest">GOA<span className="text-emerald-400">LIX</span></span></Link>
          <Link href="/dashboard" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black">⚽ Sports</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">GOALIX BET SLIP</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Mon coupon</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Retrouvez vos sélections, partagez votre code et modifiez votre coupon à tout moment.</p>
        </div>

        {message && <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300">✓ {message}</div>}

        {selections.length === 0 ? (
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">COUPON DE PARI</p><h2 className="mt-1 text-2xl font-black">Votre coupon est vide</h2></div><span className="rounded-xl bg-white/5 px-3 py-2 text-xl">🎟️</span></div>
            </div>

            <div className="border-b border-white/10 bg-emerald-500/[0.04] p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400">CODE DE RÉSERVATION</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">Un ami vous a partagé un coupon GOALIX ? Entrez son code pour le charger.</p>
              <div className="mt-4 flex gap-2">
                <input value={reservationInput} onChange={(e) => setReservationInput(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') loadCoupon(); }} placeholder="Ex. GX-M8QWF2" maxLength={9} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black tracking-[0.15em] text-white outline-none focus:border-emerald-400" />
                <button onClick={loadCoupon} disabled={loadingCoupon} className="rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black text-slate-950 disabled:opacity-60">{loadingCoupon ? 'Chargement…' : 'Charger'}</button>
              </div>
            </div>

            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-5xl">🎟️</div>
              <h3 className="mt-6 text-2xl font-black">Aucune sélection</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">Ouvrez un match depuis Sports, Live ou IA Prono puis choisissez vos marchés. Vos choix apparaîtront automatiquement ici.</p>
              <Link href="/dashboard" className="mt-7 inline-flex rounded-2xl bg-emerald-500 px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20">⚽ Découvrir les matchs</Link>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl">
            <div className="border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-5">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">COUPON DE PARI</p><h2 className="mt-1 text-2xl font-black">Vos sélections <span className="ml-1 rounded-full bg-white/10 px-2 py-1 text-sm">{selections.length}</span></h2></div><button onClick={clearCoupon} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300">Réinitialiser</button></div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"><p className="text-sm leading-6 text-cyan-100"><span className="font-black">🎉 Partagez votre coupon.</span> Utilisez le code ci-dessous pour communiquer votre coupon à un autre utilisateur.</p></div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-[11px] font-black uppercase tracking-widest text-slate-400">CODE DE RÉSERVATION</p><p className="mt-1 text-2xl font-black tracking-[0.2em] text-emerald-300">{couponCode}</p></div>
                  <div className="grid grid-cols-2 gap-2"><button onClick={copyCode} className="rounded-xl bg-white/10 px-4 py-3 text-xs font-black">{copied ? '✓ Copié' : '📋 Copier'}</button><button onClick={shareCoupon} className="rounded-xl bg-emerald-500 px-4 py-3 text-xs font-black text-slate-950">📤 Partager</button></div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {selections.map((item) => (
                  <div key={item.id} className="flex items-stretch overflow-hidden rounded-2xl border border-white/10 bg-slate-800/80 transition hover:border-emerald-400/40">
                    <Link href={`/match/${routeFor(item)}`} className="min-w-0 flex-1 p-4 hover:bg-white/[0.03]">
                      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{item.market}</p><p className="mt-1 truncate text-sm font-black text-white">⚽ {item.match}</p><p className="mt-1 text-sm font-bold text-slate-300">{item.choice}</p><p className="mt-1 text-[11px] text-slate-500">{item.league}</p></div><div className="flex shrink-0 flex-col items-end"><span className="text-xl font-black text-emerald-300">{Number(item.odds).toFixed(2)}</span><span className="mt-1 text-[10px] font-bold text-slate-500">Modifier →</span></div></div>
                    </Link>
                    <button onClick={() => removeSelection(item.id)} className="w-12 shrink-0 border-l border-white/10 bg-red-500/5 text-xl font-black text-red-300 hover:bg-red-500/10" aria-label="Supprimer">×</button>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-bold text-slate-500">COTE TOTALE</p><p className="mt-1 text-2xl font-black text-emerald-300">{totalOdds.toFixed(2)}</p></div><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-bold text-slate-500">SÉLECTIONS</p><p className="mt-1 text-2xl font-black">{selections.length}</p></div></div>

              <div className="mt-3 rounded-2xl bg-white/5 p-4"><label htmlFor="stake" className="text-xs font-black uppercase tracking-widest text-slate-500">MISE</label><div className="mt-2 flex items-center gap-3"><input id="stake" type="number" min="0" inputMode="decimal" value={stake} onChange={(e) => setStake(e.target.value)} placeholder="500" className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-slate-700"/><span className="font-black text-emerald-400">FCFA</span></div></div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-500 p-5 text-slate-950"><div><p className="text-xs font-black uppercase tracking-widest">GAIN POTENTIEL</p><p className="mt-1 text-3xl font-black">{potentialWin.toLocaleString('fr-FR',{maximumFractionDigits:0})} FCFA</p></div><span className="text-3xl">💰</span></div>

              <button onClick={validateBet} disabled={validating} className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60">{validating ? 'Validation en cours…' : '✓ Valider le pari'}</button>
              <p className="mt-2 text-center text-[10px] leading-5 text-slate-500">Mode démonstration : la validation ne débite aucun argent réel.</p>
            </div>
          </section>
        )}

        <div className="mt-5 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4 text-xs leading-5 text-amber-200/80">⚠️ Les cotes affichées actuellement sont des données de démonstration. Le stockage serveur du code de réservation devient disponible lorsque DATABASE_URL et la base PostgreSQL sont configurés.</div>
      </div>
    </main>
  );
}
