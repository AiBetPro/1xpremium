'use client';
import Link from 'next/link';
import CouponBar from '../../components/CouponBar';
import { Icon, TeamBadge } from '../../components/Icons';
import { useState } from 'react';

type LiveMatch = {
  id: string;
  league: string;
  minute: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  events: string[];
};

const liveMatches: LiveMatch[] = [
  {
    id: 'arsenal-chelsea',
    league: 'Premier League',
    minute: "67'",
    home: 'Arsenal',
    away: 'Chelsea',
    homeScore: 2,
    awayScore: 1,
    odds: {
      home: 1.55,
      draw: 3.80,
      away: 5.20,
    },
    events: [
      '⚽ 12\' Arsenal',
      '⚽ 38\' Chelsea',
      '⚽ 61\' Arsenal',
    ],
  },

  {
    id: 'barcelona-sevilla',
    league: 'La Liga',
    minute: "73'",
    home: 'Barcelona',
    away: 'Sevilla',
    homeScore: 1,
    awayScore: 0,
    odds: {
      home: 1.35,
      draw: 4.50,
      away: 7.00,
    },
    events: [
      '⚽ 29\' Barcelona',
      '🟨 54\' Sevilla',
    ],
  },

  {
    id: 'inter-milan',
    league: 'Serie A',
    minute: "41'",
    home: 'Inter',
    away: 'Milan',
    homeScore: 0,
    awayScore: 0,
    odds: {
      home: 1.90,
      draw: 2.90,
      away: 3.60,
    },
    events: [
      '🟨 18\' Inter',
      '🟨 35\' Milan',
    ],
  },
];

const marketOptions = [
  'Résultat',
  'Buts',
  'Mi-temps',
];

export default function LivePage() {
  const [selected, setSelected] = useState<string | null>(
    null
  );

  const [market, setMarket] =
    useState('Résultat');

  function selectOdd(
    matchId: string,
    selection: string
  ) {
    setSelected(`${matchId}-${selection}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-xl">←</span>

            <div>
              <div className="text-lg font-black tracking-wide">
                GOALIX
              </div>

              <div className="text-[10px] uppercase tracking-widest text-slate-400">
                Paris sportifs
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="animate-pulse rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
              🔴 LIVE
            </span>

            <Link
              href="/bets"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20"
            >
              🎟️
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        
        {/* TITLE */}
        <div className="mb-5">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            MATCHS EN DIRECT
          </div>

          <h1 className="text-3xl font-black text-slate-950">
            Paris Live
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Suivez les matchs et consultez les marchés disponibles.
          </p>
        </div>

        {/* WARNING */}
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <div className="text-xl">⚠️</div>

            <div>
              <div className="font-bold text-amber-900">
                Données de démonstration
              </div>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                Les matchs et les cotes affichés actuellement
                sont des données de démonstration. La connexion
                aux données sportives en temps réel sera ajoutée
                avec le fournisseur sportif.
              </p>
            </div>
          </div>
        </div>

        {/* MARKET FILTER */}
        <div className="mb-5 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {marketOptions.map((item) => {
              const active = market === item;

              return (
                <button
                  key={item}
                  onClick={() => setMarket(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    active
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-600 shadow-sm hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIVE MATCHES */}
        <div className="space-y-5">
          {liveMatches.map((match) => (
            <article
              key={match.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {/* LEAGUE BAR */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {match.league}
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                    <span className="text-xs font-black text-red-600">
                      EN DIRECT
                    </span>

                    <span className="text-xs font-bold text-slate-500">
                      {match.minute}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/match/${match.id}`}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Voir le match →
                </Link>
              </div>

              {/* CLICKABLE MATCH HEADER */}
              <Link
                href={`/match/${match.id}`}
                className="block px-4 py-5 transition hover:bg-slate-50"
              >
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  
                  {/* HOME */}
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-800">
                      <TeamBadge team={match.home} size="md" />
                    </div>

                    <div className="text-sm font-black text-slate-900">
                      {match.home}
                    </div>
                  </div>

                  {/* SCORE */}
                  <div className="text-center">
                    <div className="text-3xl font-black tracking-tight text-slate-950">
                      {match.homeScore}
                      <span className="mx-1 text-slate-300">
                        -
                      </span>
                      {match.awayScore}
                    </div>

                    <div className="mt-1 text-[11px] font-bold text-red-500">
                      {match.minute}
                    </div>
                  </div>

                  {/* AWAY */}
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-800">
                      <TeamBadge team={match.away} size="md" />
                    </div>

                    <div className="text-sm font-black text-slate-900">
                      {match.away}
                    </div>
                  </div>
                </div>
              </Link>

              {/* EVENTS */}
              <div className="border-t border-slate-100 px-4 py-3">
                <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                  Événements
                </div>

                <div className="flex flex-wrap gap-2">
                  {match.events.map((event, index) => (
                    <span
                      key={`${match.id}-event-${index}`}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* MARKET */}
              <div className="border-t border-slate-100 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-black text-slate-900">
                    {market}
                  </div>

                  <Link
                    href={`/match/${match.id}`}
                    className="text-xs font-bold text-emerald-600"
                  >
                    Tous les marchés →
                  </Link>
                </div>

                {/* RESULT MARKET */}
                {market === 'Résultat' && (
                  <div className="grid grid-cols-3 gap-2">
                    
                    <button
                      onClick={() =>
                        selectOdd(match.id, '1')
                      }
                      className={`rounded-xl border px-3 py-3 transition ${
                        selected === `${match.id}-1`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        1
                      </div>

                      <div className="mt-1 text-base font-black text-slate-900">
                        {match.odds.home.toFixed(2)}
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        selectOdd(match.id, 'X')
                      }
                      className={`rounded-xl border px-3 py-3 transition ${
                        selected === `${match.id}-X`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        X
                      </div>

                      <div className="mt-1 text-base font-black text-slate-900">
                        {match.odds.draw.toFixed(2)}
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        selectOdd(match.id, '2')
                      }
                      className={`rounded-xl border px-3 py-3 transition ${
                        selected === `${match.id}-2`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        2
                      </div>

                      <div className="mt-1 text-base font-black text-slate-900">
                        {match.odds.away.toFixed(2)}
                      </div>
                    </button>

                  </div>
                )}

                {/* GOALS MARKET */}
                {market === 'Buts' && (
                  <div className="grid grid-cols-2 gap-2">
                    
                    <button
                      onClick={() =>
                        selectOdd(match.id, 'over-15')
                      }
                      className={`rounded-xl border px-3 py-3 ${
                        selected === `${match.id}-over-15`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">
                        Plus de 1,5
                      </div>

                      <div className="mt-1 font-black text-slate-900">
                        1.35
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        selectOdd(match.id, 'over-25')
                      }
                      className={`rounded-xl border px-3 py-3 ${
                        selected === `${match.id}-over-25`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">
                        Plus de 2,5
                      </div>

                      <div className="mt-1 font-black text-slate-900">
                        1.70
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        selectOdd(match.id, 'under-25')
                      }
                      className={`rounded-xl border px-3 py-3 ${
                        selected === `${match.id}-under-25`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">
                        Moins de 2,5
                      </div>

                      <div className="mt-1 font-black text-slate-900">
                        2.10
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        selectOdd(match.id, 'over-35')
                      }
                      className={`rounded-xl border px-3 py-3 ${
                        selected === `${match.id}-over-35`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">
                        Plus de 3,5
                      </div>

                      <div className="mt-1 font-black text-slate-900">
                        2.40
                      </div>
                    </button>

                  </div>
                )}

                {/* HALF-TIME MARKET */}
                {market === 'Mi-temps' && (
                  <div className="grid grid-cols-3 gap-2">
                    
                    {[
                      ['1', '2.10'],
                      ['X', '2.00'],
                      ['2', '4.20'],
                    ].map(([label, odd]) => (
                      <button
                        key={label}
                        onClick={() =>
                          selectOdd(
                            match.id,
                            `ht-${label}`
                          )
                        }
                        className={`rounded-xl border px-3 py-3 ${
                          selected ===
                          `${match.id}-ht-${label}`
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          {label}
                        </div>

                        <div className="mt-1 font-black text-slate-900">
                          {odd}
                        </div>
                      </button>
                    ))}

                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
                
                <Link
                  href={`/match/${match.id}`}
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  📊 Statistiques
                </Link>

                <Link
                  href="/bets"
                  className="flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
                >
                  🎟️ Coupon
                </Link>

              </div>
            </article>
          ))}
        </div>

        {/* AI BANNER */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            <div>
              <div className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                🤖 GOALIX IA
              </div>

              <h2 className="text-xl font-black">
                Besoin d'une analyse ?
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Consulte les analyses et suggestions générées
                à partir des données disponibles.
              </p>
            </div>

            <Link
              href="/ai-prono"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-black text-white hover:bg-emerald-400"
            >
              Voir IA Prono →
            </Link>

          </div>
        </div>
      </section>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-bold text-slate-500"
          >
            <span className="text-lg">⚽</span>
            Sports
          </Link>

          <Link
            href="/live"
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-black text-red-500"
          >
            <span className="text-lg">🔴</span>
            Live
          </Link>

          <Link
            href="/ai-prono"
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-bold text-slate-500"
          >
            <span className="text-lg">🤖</span>
            IA
          </Link>

          <Link
            href="/bets"
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-bold text-slate-500"
          >
            <span className="text-lg">🎟️</span>
            Coupon
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-bold text-slate-500"
          >
            <span className="text-lg">👤</span>
            Compte
          </Link>

        </div>
      </nav>
    <CouponBar />
      </main>
  );
      }
