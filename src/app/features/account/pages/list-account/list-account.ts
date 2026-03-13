import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import type { Account } from '@features/account/interfaces';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { Button, Search, Table } from '@shared/components';
import type { TableAction, TableColumn } from '@shared/interfaces';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'ctc-list-account',
  imports: [Table, Button, Search],
  templateUrl: './list-account.html',
  styleUrl: './list-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListAccount {
  private readonly accountStore = inject(AccountStore);
  private readonly clientStore = inject(ClientStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly rawQuery = signal('');

  public filteredAccounts = this.accountStore.filteredAccounts;

  constructor() {
    this.accountStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.clientStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    toObservable(this.rawQuery)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(query => {
        this.accountStore.setSearchQuery(query);
      });
  }

  columns: TableColumn<Account>[] = [
    { key: 'accountNumber', header: 'N° Cuenta', cell: a => a.accountNumber },
    { key: 'type', header: 'Tipo', cell: a => (a.type === 'savings' ? 'Ahorros' : 'Corriente') },
    {
      key: 'openingBalance',
      header: 'Saldo inicial',
      cell: a => `$${a.openingBalance.toFixed(2)}`,
    },
    { key: 'status', header: 'Estado', cell: a => (a.status ? 'Activo' : 'Inactivo') },
    {
      key: 'clientId',
      header: 'Cliente',
      cell: a => this.clientStore.clients().find(c => c.id === a.clientId)?.name ?? 'N/A',
    },
  ];

  actions: TableAction<Account>[] = [
    {
      label: 'Editar',
      color: 'primary',
      handler: a => {
        this.edit(a);
      },
    },
    {
      label: 'Eliminar',
      color: 'danger',
      handler: a => {
        this.delete(a);
      },
    },
  ];

  public create(): void {
    this.router.navigateByUrl('/account/create');
  }

  public onSearch(query: string): void {
    this.rawQuery.set(query);
  }

  public edit(account: Account): void {
    this.router.navigateByUrl(`/account/edit/${account.id}`);
  }

  public delete(account: Account): void {
    if (!confirm(`¿Está seguro de eliminar la cuenta ${account.accountNumber}?`)) return;

    this.accountStore
      .delete(account.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert(`Cuenta ${account.accountNumber} eliminada`);
      });
  }
}
