export interface Account {
  id: string;
  accountNumber: string;
  type: 'savings' | 'checking';
  openingBalance: number;
  status: boolean;
  clientId: string;
}
