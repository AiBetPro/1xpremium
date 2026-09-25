export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  date: string;
  league: string;
}

export interface Bet {
  id: number;
  match_id: number;
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost';
  created_at: string;
}

export interface Prediction {
  id: number;
  match_id: number;
  prediction: string;
  confidence: number;
  created_at: string;
}

export const mockMatches: Match[] = [];
export const mockBets: Bet[] = [];
export const mockPredictions: Prediction[] = [];
