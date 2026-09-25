export type RiskProfile =
  | 'prudent'
  | 'equilibre'
  | 'audacieux';

export interface AIRanking {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  selection: string;
  odds: number;
  score: number;
  probability: number;
  risk: RiskProfile;
  reason: string;
}

export function rankMatches(matches: any[] = []): AIRanking[] {
  return matches
    .map((match: any) => {
      const odds = Number(
        match.homeOdd ??
        match.odds?.home ??
        match.odds?.homeWin ??
        1.5
      );

      const safeOdds = odds > 1 ? odds : 1.5;

      const probability = Math.min(
        95,
        Math.max(
          5,
          Math.round((1 / safeOdds) * 100)
        )
      );

      let risk: RiskProfile = 'audacieux';

      if (safeOdds <= 1.5) {
        risk = 'prudent';
      } else if (safeOdds <= 2.2) {
        risk = 'equilibre';
      }

      return {
        matchId: String(match.id ?? ''),
        homeTeam: String(
          match.homeTeam ?? 'Équipe domicile'
        ),
        awayTeam: String(
          match.awayTeam ?? 'Équipe extérieure'
        ),
        league: String(
          match.league ?? 'Football'
        ),
        selection: `${match.homeTeam ?? 'Équipe domicile'} gagne`,
        odds: safeOdds,
        score: probability,
        probability,
        risk,
        reason:
          'Analyse indicative basée sur les données disponibles et les cotes.',
      };
    })
    .sort((a, b) => b.score - a.score);
  }
