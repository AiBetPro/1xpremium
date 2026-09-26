'use client';

import { useMemo, useState } from 'react';
import CouponBar from '../../components/CouponBar';

type RiskProfile = 'prudent' | 'equilibre' | 'audacieux';

type Match = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  odds: number;
  score: number;
  probability: number;
  risk: RiskProfile;
  reason: string;
};

const matches: Match[] = [
  {
    id: 'arsenal-chelsea',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    selection: 'Arsenal gagne',
    odds: 1.65,
    score: 82,
    probability: 61,
    risk: 'prudent',
    reason:
      'La cote disponible favorise Arsenal. Cette sélection présente un profil relativement prudent dans cette démonstration.',
  },
  {
    id: 'barcelona-sevilla',
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Sevilla',
    selection: 'Barcelona gagne',
    odds: 1.42,
    score: 91,
    probability: 70,
    risk: 'prudent',
    reason:
      'Barcelona possède ici la cote la plus basse. Le modèle de démonstration classe cette sélection parmi les options prudentes.',
  },
  {
    id: 'inter-milan',
    league: 'Serie A',
    homeTeam: 'Inter',
    awayTeam: 'Milan',
    selection: 'Inter gagne',
    odds: 1.75,
    score: 76,
    probability: 57,
    risk: 'equilibre',
    reason:
      'La cote offre ici un compromis entre niveau de risque et gain potentiel.',
  },
];

const riskLabels: Record<RiskProfile, string> = {
  prudent: 'Prudent',
  equilibre: 'Équilibré',
  audacieux: 'Audacieux',
};

export default function AIPronoPage() {
  const [risk, setRisk] = useState<RiskProfile>('prudent');
  const [selected, setSelected] = useState<Match[]>([]);
  const [generated, setGenerated] = useState(false);

  const filteredMatches = useMemo(() => {
    if (risk === 'prudent') {
      return matches.filter((match) => match.risk === 'prudent');
    }

    if (risk === 'equilibre') {
      return matches.filter(
        (match) =>
          match.risk === 'prudent' ||
          match.risk === 'equilibre'
      );
    }

    return matches;
  }, [risk]);

  const totalOdds = useMemo(() => {
    if (selected.length === 0) return 0;

    return selected.reduce(
      (total, match) => total * match.odds,
      1
    );
  }, [selected]);

  function toggleSelection(match: Match) {
    setSelected((current) => {
      const exists = current.some(
        (item) => item.id === match.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== match.id
        );
      }

      return [...current, match];
    });
  }

  function generateCoupon() {
    const recommended = [...filteredMatches]
      .sort((a, b) => b.score - a.score)
      .slice(0, risk === 'prudent' ? 2 : 3);

    setSelected(recommended);
    setGenerated(true);
  }

  return (
    <main className="ai-page">

      {/* LOGO IA */}
      <section className="ai-brand">
        <div className="ai-orbit">
          <div className="ai-logo-core">
            <span>G</span>
          </div>
        </div>

        <div className="ai-brand-name">
          GOA<span>LIX</span>
        </div>

        <div className="ai-brand-label">
          <span className="ai-status-dot" />
          ARTIFICIAL INTELLIGENCE
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="ai-intro">
        <div className="ai-eyebrow">
          🤖 GOALIX AI
        </div>

        <h1>
          IA <span>Prono</span>
        </h1>

        <p>
          Analysez les matchs disponibles et laissez
          GOALIX AI vous aider à construire votre coupon.
        </p>
      </section>

      {/* PROFIL DE RISQUE */}
      <section className="ai-risk-card">

        <div className="ai-section-label">
          VOTRE PROFIL
        </div>

        <h2>
          Quel style de pari recherchez-vous ?
        </h2>

        <div className="ai-risk-grid">
          {(
            ['prudent', 'equilibre', 'audacieux'] as RiskProfile[]
          ).map((item) => (
            <button
              key={item}
              onClick={() => {
                setRisk(item);
                setGenerated(false);
              }}
              className={`ai-risk-button ${
                risk === item ? 'active' : ''
              } ${item}`}
            >
              <span className="risk-icon">
                {item === 'prudent'
                  ? '🟢'
                  : item === 'equilibre'
                  ? '🟡'
                  : '🔴'}
              </span>

              <span>{riskLabels[item]}</span>
            </button>
          ))}
        </div>

        <button
          onClick={generateCoupon}
          className="ai-generate-button"
        >
          <span>🤖</span>
          Générer mon coupon IA
          <span className="arrow">→</span>
        </button>
      </section>

      {/* MESSAGE */}
      {generated && (
        <div className="ai-success">
          <div className="success-icon">✓</div>

          <div>
            <strong>Coupon IA généré</strong>

            <p>
              Les meilleures sélections selon votre profil
              ont été ajoutées.
            </p>
          </div>
        </div>
      )}

      {/* MATCHS */}
      <section className="ai-matches">

        <div className="ai-section-heading">
          <div>
            <span>ANALYSE GOALIX</span>
            <h2>Matchs recommandés</h2>
          </div>

          <div className="match-count">
            {filteredMatches.length}
          </div>
        </div>

        <div className="ai-match-list">

          {filteredMatches.map((match) => {
            const isSelected = selected.some(
              (item) => item.id === match.id
            );

            return (
              <article
                key={match.id}
                className={`ai-match-card ${
                  isSelected ? 'selected' : ''
                }`}
              >

                <div className="match-top">
                  <span>{match.league}</span>

                  <div className="ai-score">
                    <small>IA SCORE</small>
                    <strong>{match.score}</strong>
                  </div>
                </div>

                <div className="match-teams">
                  <strong>{match.homeTeam}</strong>

                  <div className="match-vs">
                    VS
                  </div>

                  <strong>{match.awayTeam}</strong>
                </div>

                <div className="ai-selection">
                  <span>PRONOSTIC</span>

                  <strong>
                    {match.selection}
                  </strong>

                  <b>
                    {match.odds.toFixed(2)}
                  </b>
                </div>

                <div className="ai-stat-grid">

                  <div>
                    <small>
                      Probabilité indicative
                    </small>

                    <strong>
                      {match.probability}%
                    </strong>
                  </div>

                  <div>
                    <small>
                      Niveau
                    </small>

                    <strong>
                      {riskLabels[match.risk]}
                    </strong>
                  </div>

                </div>

                <div className="ai-reason">
                  <span>💡</span>

                  <p>{match.reason}</p>
                </div>

                <button
                  onClick={() =>
                    toggleSelection(match)
                  }
                  className={`ai-add-button ${
                    isSelected ? 'remove' : ''
                  }`}
                >
                  {isSelected
                    ? '✓ Retirer du coupon'
                    : '+ Ajouter au coupon'}
                </button>

              </article>
            );
          })}

        </div>
      </section>

      {/* COUPON IA */}
      <section className="ai-coupon">

        <div className="coupon-header">
          <div>
            <span>🎟️</span>

            <div>
              <small>GOALIX AI</small>
              <h2>Mon coupon IA</h2>
            </div>
          </div>

          <strong>
            {selected.length}
          </strong>
        </div>

        {selected.length === 0 ? (
          <div className="coupon-empty">
            <div>🎟️</div>

            <p>
              Aucun pari sélectionné
            </p>

            <small>
              Ajoutez des recommandations ci-dessus.
            </small>
          </div>
        ) : (
          <>
            <div className="coupon-selections">

              {selected.map((match) => (
                <div
                  key={match.id}
                  className="coupon-selection"
                >
                  <div>
                    <strong>
                      {match.homeTeam} — {match.awayTeam}
                    </strong>

                    <span>
                      {match.selection}
                    </span>
                  </div>

                  <b>
                    {match.odds.toFixed(2)}
                  </b>
                </div>
              ))}

            </div>

            <div className="coupon-total">
              <span>Cote totale</span>

              <strong>
                {totalOdds.toFixed(2)}
              </strong>
            </div>
          </>
        )}

        <a
          href="/bets"
          className="ai-open-coupon"
        >
          Ouvrir mon coupon
          <span>→</span>
        </a>

      </section>

      {/* AVERTISSEMENT */}
      <div className="ai-warning">
        ⚠️ Les analyses et probabilités sont indicatives.
        Elles ne garantissent aucun résultat. Les paris
        sportifs comportent un risque de perte.
      </div>

      <footer className="ai-footer">
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
