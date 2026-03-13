import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { Movement } from '@features/movement/interfaces';
import { MovementStore } from '@features/movement/store';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { Button, Table } from '@shared/components';
import type { TableAction, TableColumn } from '@shared/interfaces';

@Component({
  selector: 'ctc-list-movement',
  imports: [Table, Button, ReactiveFormsModule],
  templateUrl: './list-movement.html',
  styleUrl: './list-movement.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListMovement {
  private readonly movementStore = inject(MovementStore);
  private readonly accountStore = inject(AccountStore);
  private readonly clientStore = inject(ClientStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected filterClientId = signal('');
  protected filterDateFrom = signal('');
  protected filterDateTo = signal('');

  protected filteredMovements = computed(() => {
    const clientId = this.filterClientId();
    const from = this.filterDateFrom();
    const to = this.filterDateTo();

    return this.movementStore.movements().filter(m => {
      const account = this.accountStore.accounts().find(a => a.id === m.accountId);
      if (clientId && account?.clientId !== clientId) return false;
      if (from && m.date < from) return false;
      if (to && m.date > to) return false;
      return true;
    });
  });

  protected clientOptions = computed(() => this.clientStore.clients());

  columns: TableColumn<Movement>[] = [
    { key: 'date', header: 'Date', cell: m => m.date },
    {
      key: 'accountId',
      header: 'Account',
      cell: m =>
        this.accountStore.accounts().find(a => a.id === m.accountId)?.accountNumber ?? 'N/A',
    },
    {
      key: 'client',
      header: 'Client',
      cell: m => {
        const account = this.accountStore.accounts().find(a => a.id === m.accountId);
        return this.clientStore.clients().find(c => c.id === account?.clientId)?.name ?? 'N/A';
      },
    },
    {
      key: 'type',
      header: 'Type',
      cell: m => (m.type === 'deposit' ? 'Deposit' : 'Withdrawal'),
    },
    { key: 'amount', header: 'Amount', cell: m => `$${Math.abs(m.amount).toFixed(2)}` },
    { key: 'balance', header: 'Balance', cell: m => `$${m.balance.toFixed(2)}` },
  ];

  actions: TableAction<Movement>[] = [
    {
      label: 'Delete',
      color: 'danger',
      handler: m => {
        this.delete(m);
      },
    },
  ];

  public onCreate(): void {
    this.router.navigateByUrl('/movement/create');
  }

  public onFilterClient(event: Event): void {
    this.filterClientId.set((event.target as HTMLSelectElement).value);
  }

  public onFilterDateFrom(event: Event): void {
    this.filterDateFrom.set((event.target as HTMLInputElement).value);
  }

  public onFilterDateTo(event: Event): void {
    this.filterDateTo.set((event.target as HTMLInputElement).value);
  }

  public delete(movement: Movement): void {
    if (!confirm('Are you sure you want to delete this movement?')) return;

    this.movementStore
      .delete(movement.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Movement deleted');
      });
  }
}
