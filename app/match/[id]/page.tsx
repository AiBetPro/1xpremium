'use client';

import { useParams } from 'next/navigation';
import CouponBar from '../../../components/CouponBar';
import { TeamBadge } from '../../../components/Icons';
import { useState } from 'react';

type MatchInfo = {
  id: string;
  league: string;
  home: string;
  away: string;
  time: string;
};

type Selection = {
  id: string;
  label: string;
  odds: number;
};

type Market = {
  id: string;
  name: string;
  selections: Selection[];
};

const matches: Record<string, MatchInfo> = {
  'arsenal-chelsea': {
    id: 'arsenal-chelsea',
    league: 'Premier League',
    home: 'Arsenal',
    away: 'Chelsea',
    time: '18:00',
  },

  'barcelona-sevilla': {
    id: 'barcelona-sevilla',
    league: 'La Liga',
    home: 'Barcelona',
    away: 'Sevilla',
    time: '20:30',
  },

  'inter-milan': {
    id: 'inter-milan',
    league: 'Serie A',
    home: 'Inter',
    away: 'Milan',
    time: '21:00',
  },

  'psg-lyon': {
    id: 'psg-lyon',
    league: 'Ligue 1',
    home: 'PSG',
    away: 'Lyon',
    time: '21:00',
  },

  'real-atletico': {
    id: 'real-atletico',
    league: 'La Liga',
    home: 'Real Madrid',
    away: 'Atlético Madrid',
    time: '22:00',
  },
};

function createMarkets(home: string, away: string): Market[] {
  return [
    {
      id: 'result',
      name: 'Résultat du match',
      selections: [
        {
          id: 'home',
          label: home,
          odds: 1.65,
        },
        {
          id: 'draw',
          label: 'Match nul',
          odds: 3.70,
        },
        {
          id: 'away',
          label: away,
          odds: 4.90,
        },
      ],
    },

    {
      id: 'double-chance',
      name: 'Double chance',
      selections: [
        {
          id: '1x',
          label: '1X',
          odds: 1.20,
        },
        {
          id: 'x2',
          label: 'X2',
          odds: 1.85,
        },
        {
          id: '12',
          label: '12',
          odds: 1.30,
        },
      ],
    },

    {
      id: 'total-goals',
      name: 'Total buts',
      selections: [
        {
          id: 'over-15',
          label: 'Plus de 1,5',
          odds: 1.35,
        },
        {
          id: 'under-15',
          label: 'Moins de 1,5',
          odds: 2.80,
        },
        {
          id: 'over-25',
          label: 'Plus de 2,5',
          odds: 1.70,
        },
        {
          id: 'under-25',
          label: 'Moins de 2,5',
          odds: 2.10,
        },
        {
          id: 'over-35',
          label: 'Plus de 3,5',
          odds: 2.40,
        },
        {
          id: 'under-35',
          label: 'Moins de 3,5',
          odds: 1.50,
        },
      ],
    },

    {
      id: 'btts',
      name: 'Les deux équipes marquent',
      selections: [
        {
          id: 'yes',
          label: 'Oui',
          odds: 1.62,
        },
        {
          id: 'no',
          label: 'Non',
          odds: 2.15,
        },
      ],
    },

    {
      id: 'team-goals',
      name: 'Buts équipe',
      selections: [
        {
          id: 'home-over-05',
          label: `${home} +0,5`,
          odds: 1.25,
        },
        {
          id: 'home-over-15',
          label: `${home} +1,5`,
          odds: 1.75,
        },
        {
          id: 'away-over-05',
          label: `${away} +0,5`,
          odds: 1.55,
        },
        {
          id: 'away-over-15',
          label: `${away} +1,5`,
          odds: 2.30,
        },
      ],
    },

    {
      id: 'correct-score',
      name: 'Score exact',
      selections: [
        {
          id: 'score-10',
          label: '1 - 0',
          odds: 7.00,
        },
        {
          id: 'score-11',
          label: '1 - 1',
          odds: 6.50,
        },
        {
          id: 'score-20',
          label: '2 - 0',
          odds: 7.50,
        },
        {
          id: 'score-21',
          label: '2 - 1',
          odds: 8.00,
        },
        {
          id: 'score-22',
          label: '2 - 2',
          odds: 12.00,
        },
        {
          id: 'score-01',
          label: '0 - 1',
          odds: 10.00,
        },
      ],
    },
  ];
}

export default function MatchPage() {
  const params = useParams();

  const matchId = String(
    params?.id ?? 'arsenal-chelsea'
  );

  const match =
    matches[matchId] ??
    matches['arsenal-chelsea'];

  const markets = createMarkets(
    match.home,
    match.away
  );

  const [added, setAdded] =
    useState<string | null>(null);

  function addToCoupon(
    marketName: string,
    selection: Selection
  ) {
    const couponSelection = {
      matchId: match.id,
      id: `${match.id}-${marketName}-${selection.id}`,
      match: `${match.home} vs ${match.away}`,
      league: match.league,
      market: marketName,
      choice: selection.label,
      odds: selection.odds,
    };

    try {
      const saved =
        localStorage.getItem(
          'goalix_selections'
        );

      const current = saved
        ? JSON.parse(saved)
        : [];

      const sameMarket = current.filter(
        (item: any) =>
          item.matchId === match.id &&
          item.market === marketName
      );

      const withoutSameMarket = current.filter(
        (item: any) =>
          !(item.matchId === match.id &&
            item.market === marketName)
      );

      const alreadySelected = current.some(
        (item: any) => item.id === couponSelection.id
      );

      const next = alreadySelected
        ? current
        : [...withoutSameMarket, couponSelection];

      localStorage.setItem(
        'goalix_selections',
        JSON.stringify(next)
      );
      window.dispatchEvent(new Event('goalix:coupon-updated'));

      if (!localStorage.getItem('goalix_coupon_code')) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'GX-';
        for (let i = 0; i < 6; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        localStorage.setItem('goalix_coupon_code', code);
      }

      if (sameMarket.length > 0) {
        // Une seule sélection par marché pour un même match.
        // La nouvelle sélection remplace l'ancienne.
      }

      setAdded(
        `${marketName}-${selection.id}`
      );

      setTimeout(() => {
        setAdded(null);
      }, 1500);
    } catch (error) {
      console.error(
        'Erreur ajout coupon:',
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">

      {/* HEADER */}

      <header className="bg-slate-950 text-white">

        <div className="mx-auto max-w-3xl px-4 py-4">

          <div className="flex items-center justify-between gap-3">

            <a
              href="/dashboard"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold"
            >
              ← Retour
            </a>

            <a
              href="/bets"
              className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-black"
            >
              🎟️ Coupon
            </a>

          </div>

          {/* MATCH */}

          <div className="mt-7 pb-2 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              {match.league}
            </p>

            <p className="mt-2 text-xs font-bold text-slate-400">
              Aujourd'hui · {match.time}
            </p>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">

              <div className="min-w-0">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-black">
                  <TeamBadge team={match.home} size="md" />
                </div>

                <h1 className="mt-2 truncate text-lg font-black">
                  {match.home}
                </h1>

              </div>

              <div className="text-center">

                <span className="text-xs font-black text-slate-500">
                  VS
                </span>

              </div>

              <div className="min-w-0">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-black">
                  <TeamBadge team={match.away} size="md" />
                </div>

                <h2 className="mt-2 truncate text-lg font-black">
                  {match.away}
                </h2>

              </div>

            </div>

            <p className="mt-4 text-xs text-slate-500">
              Match de démonstration
            </p>

          </div>

        </div>

      </header>

      {/* CONTENU */}

      <div className="mx-auto max-w-3xl px-4 py-5">

        {/* AVERTISSEMENT */}

        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">

          ⚠️ Les cotes affichées sont
          actuellement des données de
          démonstration. Les vraies cotes
          Sportmonks seront intégrées ensuite.

        </div>

        {/* TITRE */}

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            MARCHÉS
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Choisissez votre pari
          </h2>

        </div>

        {/* MARCHÉS */}

        <div className="space-y-4">

          {markets.map((market) => (

            <section
              key={market.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
            >

              <div className="border-b border-slate-100 px-4 py-3">

                <h3 className="text-base font-black text-slate-950">
                  {market.name}
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">

                {market.selections.map(
                  (selection) => {

                    const selectionKey =
                      `${market.name}-${selection.id}`;

                    const isAdded =
                      added === selectionKey;

                    return (
                      <button
                        key={selection.id}
                        type="button"
                        onClick={() =>
                          addToCoupon(
                            market.name,
                            selection
                          )
                        }
                        className={`min-h-[72px] rounded-xl border px-3 py-3 text-left transition active:scale-[0.97] ${
                          isAdded
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >

                        <p className="truncate text-sm font-bold text-slate-800">
                          {selection.label}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">

                          <span className="text-lg font-black text-emerald-600">
                            {selection.odds.toFixed(2)}
                          </span>

                          {isAdded && (
                            <span className="text-xs font-black text-emerald-600">
                              ✓
                            </span>
                          )}

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </section>

          ))}

        </div>

        {/* BOUTON COUPON */}

        <div className="sticky bottom-4 z-10 mt-6">

          <a
            href="/bets"
            className="block w-full rounded-2xl bg-emerald-600 px-5 py-4 text-center text-base font-black text-white shadow-xl"
          >
            🎟️ Voir mon coupon
            {added ? ' · ✓ Sélection ajoutée' : ''}
          </a>

        </div>

      </div>

    <CouponBar />
      </main>
  );
      }
