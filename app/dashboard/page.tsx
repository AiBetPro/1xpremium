'use client';
import Link from 'next/link';
import CouponBar from '../../components/CouponBar';
import { Icon, TeamBadge } from '../../components/Icons';
import { useState } from 'react';

type Match = {
  id: string;
  league: string;
  time: string;
  home: string;
  away: string;
  homeOdd: string;
  drawOdd: string;
  awayOdd: string;
  live?: boolean;
};

const matches: Match[] = [
  {
    id: 'arsenal-chelsea',
    league: 'Premier League',
    time: '18:00',
    home: 'Arsenal',
    away: 'Chelsea',
    homeOdd: '1.65',
    drawOdd: '3.70',
    awayOdd: '4.90',
  },
  {
    id: 'barcelona-sevilla',
    league: 'La Liga',
    time: '20:30',
    home: 'Barcelona',
    away: 'Sevilla',
    homeOdd: '1.42',
    drawOdd: '4.40',
    awayOdd: '6.80',
  },
  {
    id: 'inter-milan',
    league: 'Serie A',
    time: '21:00',
    home: 'Inter',
    away: 'Milan',
    homeOdd: '1.75',
    drawOdd: '3.50',
    awayOdd: '4.30',
  },
  {
    id: 'psg-lyon',
    league: 'Ligue 1',
    time: '21:00',
    home: 'PSG',
    away: 'Lyon',
    homeOdd: '1.48',
    drawOdd: '4.20',
    awayOdd: '5.90',
  },
  {
    id: 'real-atletico',
    league: 'La Liga',
    time: '22:00',
    home: 'Real Madrid',
    away: 'Atlético Madrid',
    homeOdd: '1.72',
    drawOdd: '3.60',
    awayOdd: '4.60',
  },
];

const sports = [
  { icon: '⚽', name: 'Football', count: '245' },
  { icon: '🏀', name: 'Basketball', count: '38' },
  { icon: '🎾', name: 'Tennis', count: '64' },
  { icon: '🏎️', name: 'F1', count: '12' },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] =
    useState('Football');

  const filteredMatches = matches.filter((match) => {
    const text = `${match.home} ${match.away} ${match.league}`
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-logo">
          GOA<span>LIX</span>
        </div>

        <Link
          href="/connexion"
          className="dashboard-account"
          aria-label="Compte"
        >
          <Icon name="user" size={20} />
        </Link>

      </header>

      {/* BALANCE */}
      <section className="balance-card">

        <div className="balance-top">
          <div>
            <span>MON SOLDE</span>

            <strong>
              0 FCFA
            </strong>
          </div>

          <div className="balance-icon"><Icon name="wallet" size={22}/></div>
        </div>

        <div className="balance-actions">

          <button>
            + Dépôt
          </button>

          <button>
            Retrait
          </button>

        </div>

        <p>
          Mode démonstration — aucun argent réel.
        </p>

      </section>

      {/* SEARCH */}
      <div className="dashboard-search">

        <span><Icon name="search" size={19}/></span>

        <input
          type="text"
          placeholder="Rechercher une équipe ou un match..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>

      {/* SPORTS */}
      <section className="dashboard-section">

        <div className="dashboard-title">
          <div>
            <span>EXPLORER</span>
            <h2>Sports</h2>
          </div>

          <span className="dashboard-count">
            {sports.length}
          </span>
        </div>

        <div className="sports-scroll">

          {sports.map((sport) => (

            <button
              key={sport.name}
              onClick={() =>
                setSelectedSport(sport.name)
              }
              className={`dashboard-sport ${
                selectedSport === sport.name
                  ? 'active'
                  : ''
              }`}
            >

              <span className="sport-icon">
                {sport.icon}
              </span>

              <strong>
                {sport.name}
              </strong>

              <small>
                {sport.count} matchs
              </small>

            </button>

          ))}

        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions">

        <a href="/live" className="quick-card live-card">

          <div>
            <span className="quick-icon">🔴</span>

            <strong>
              Matchs Live
            </strong>

            <small>
              Voir les matchs en direct
            </small>
          </div>

          <span className="quick-arrow">
            →
          </span>

        </a>

        <a href="/ai-prono" className="quick-card ai-card">

          <div>
            <span className="quick-icon">🤖</span>

            <strong>
              IA Prono
            </strong>

            <small>
              Générer un coupon intelligent
            </small>
          </div>

          <span className="quick-arrow">
            →
          </span>

        </a>

      </section>

      {/* MATCHS */}
      <section className="dashboard-section matches-dashboard">

        <div className="dashboard-title">

          <div>
            <span>AUJOURD&apos;HUI</span>
            <h2>
              Matchs populaires
            </h2>
          </div>

          <a href="/live">
            Tout voir →
          </a>

        </div>

        <div className="dashboard-matches">

          {filteredMatches.length === 0 ? (

            <div className="no-results">
              <span>🔎</span>

              <strong>
                Aucun match trouvé
              </strong>

              <p>
                Essayez une autre recherche.
              </p>
            </div>

          ) : (

            filteredMatches.map((match) => (

              <a
  key={match.id}
  href={`/match/${match.id}`}
  className="dashboard-match"
>

                <div className="match-header">

                  <span>
                    {match.league}
                  </span>

                  <time>
                    {match.time}
                  </time>

                </div>

                <div className="match-body">

                  <div className="dashboard-team">

                    <TeamBadge team={match.home} size="md" />

                    <strong>
                      {match.home}
                    </strong>

                  </div>

                  <div className="dashboard-vs">
                    VS
                  </div>

                  <div className="dashboard-team">

                    <TeamBadge team={match.away} size="md" />

                    <strong>
                      {match.away}
                    </strong>

                  </div>

                </div>

                <div className="odds-title">
                  RÉSULTAT DU MATCH
                </div>

                <div className="odds-grid">

                  <button>
                    <small>1</small>
                    <strong>
                      {match.homeOdd}
                    </strong>
                  </button>

                  <button>
                    <small>X</small>
                    <strong>
                      {match.drawOdd}
                    </strong>
                  </button>

                  <button>
                    <small>2</small>
                    <strong>
                      {match.awayOdd}
                    </strong>
                  </button>

                </div>

              </a>

            ))

          )}

        </div>

      </section>

      {/* AI BANNER */}
      <section className="dashboard-ai-banner">

        <div>

          <span>
            🤖 GOALIX AI
          </span>

          <h2>
            Besoin d&apos;une analyse ?
          </h2>

          <p>
            Laissez notre système analyser les
            opportunités disponibles.
          </p>

          <a href="/ai-prono">
            Découvrir IA Prono →
          </a>

        </div>

        <div className="dashboard-ai-orb">
          AI
        </div>

      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">

        <strong>
          GOA<span>LIX</span>
        </strong>

        <p>
          Sports Betting & AI Predictions
        </p>

      </footer>

    <CouponBar />
      </main>
  );
    }
