import { Bet, Match } from './data';

class BetStore {
  private bets: Bet[] = [];
  private nextId = 1;

  addBet(bet: Omit<Bet, 'id' | 'created_at'>): Bet {
    const newBet: Bet = {
      ...bet,
      id: this.nextId++,
      created_at: new Date().toISOString(),
    };
    this.bets.push(newBet);
    return newBet;
  }

  getBets(): Bet[] {
    return this.bets;
  }

  getBetById(id: number): Bet | undefined {
    return this.bets.find(bet => bet.id === id);
  }

  updateBetStatus(id: number, status: Bet['status']): Bet | undefined {
    const bet = this.getBetById(id);
    if (bet) {
      bet.status = status;
    }
    return bet;
  }

  deleteBet(id: number): boolean {
    const index = this.bets.findIndex(bet => bet.id === id);
    if (index > -1) {
      this.bets.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const betStore = new BetStore();
export default betStore;
