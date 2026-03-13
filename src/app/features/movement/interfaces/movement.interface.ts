export interface Movement {
  id: string;
  date: string;
  accountId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balance: number;
}
