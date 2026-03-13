import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { MovementStore } from '@features/movement/store';
import { Button } from '@shared/components';
import type { MovementReportRow } from '@shared/interfaces';
import { PdfService } from '@shared/services';

@Component({
  selector: 'ctc-movement-report',
  imports: [Button],
  templateUrl: './movement-report.html',
  styleUrl: './movement-report.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MovementReport {
  private readonly movementStore = inject(MovementStore);
  private readonly accountStore = inject(AccountStore);
  private readonly clientStore = inject(ClientStore);
  private readonly pdfService = inject(PdfService);

  protected readonly Math = Math;

  protected filterClientId = signal('');
  protected filterDateFrom = signal('');
  protected filterDateTo = signal('');

  protected clientOptions = computed(() => this.clientStore.clients());

  protected filteredRows = computed<MovementReportRow[]>(() => {
    const clientId = this.filterClientId();
    const from = this.filterDateFrom();
    const to = this.filterDateTo();

    return this.movementStore
      .movements()
      .filter(m => {
        const account = this.accountStore.accounts().find(a => a.id === m.accountId);
        if (clientId && account?.clientId !== clientId) return false;
        if (from && m.date < from) return false;
        if (to && m.date > to) return false;
        return true;
      })
      .map(m => {
        const account = this.accountStore.accounts().find(a => a.id === m.accountId);
        const client = this.clientStore.clients().find(c => c.id === account?.clientId);
        return {
          date: m.date,
          client: client?.name ?? 'N/A',
          accountNumber: account?.accountNumber ?? 'N/A',
          accountType: account?.type === 'savings' ? 'Savings' : 'Checking',
          type: m.type === 'deposit' ? 'Deposit' : 'Withdrawal',
          amount: m.amount,
          balance: m.balance,
        };
      });
  });

  protected totalDeposits = computed(() =>
    this.filteredRows()
      .filter(r => r.amount > 0)
      .reduce((sum, r) => sum + r.amount, 0)
  );

  protected totalWithdrawals = computed(() =>
    this.filteredRows()
      .filter(r => r.amount < 0)
      .reduce((sum, r) => sum + Math.abs(r.amount), 0)
  );

  protected netBalance = computed(() => this.totalDeposits() - this.totalWithdrawals());

  public onFilterClient(event: Event): void {
    this.filterClientId.set((event.target as HTMLSelectElement).value);
  }

  public onFilterDateFrom(event: Event): void {
    this.filterDateFrom.set((event.target as HTMLInputElement).value);
  }

  public onFilterDateTo(event: Event): void {
    this.filterDateTo.set((event.target as HTMLInputElement).value);
  }

  public downloadPdf(): void {
    const parts: string[] = [];
    const clientName = this.clientOptions().find(c => c.id === this.filterClientId())?.name;
    if (clientName) parts.push(`Client: ${clientName}`);
    if (this.filterDateFrom()) parts.push(`From: ${this.filterDateFrom()}`);
    if (this.filterDateTo()) parts.push(`To: ${this.filterDateTo()}`);

    this.pdfService.downloadMovementReport(this.filteredRows(), parts.join('  |  '));
  }
}
