import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import type { Client } from '@features/client/interfaces';
import { ClientStore } from '@features/client/store';
import { Button, Search, Table } from '@shared/components';
import type { TableAction, TableColumn } from '@shared/interfaces';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'ctc-list-client',
  imports: [Table, Button, Search],
  templateUrl: './list-client.html',
  styleUrl: './list-client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListClient {
  private readonly clientStore = inject(ClientStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly rawQuery = signal('');

  public filteredClients = this.clientStore.filteredClients;

  constructor() {
    this.clientStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    toObservable(this.rawQuery)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(query => {
        this.clientStore.setSearchQuery(query);
      });
  }

  columns: TableColumn<Client>[] = [
    { key: 'name', header: 'Nombre', cell: u => u.name },
    { key: 'adress', header: 'Dirección', cell: u => u.adress },
    { key: 'phone', header: 'Teléfono', cell: u => u.phone },
    { key: 'status', header: 'Estado', cell: u => (u.status ? 'Activo' : 'Inactivo') },
  ];

  actions: TableAction<Client>[] = [
    {
      label: 'Editar',
      color: 'primary',
      handler: u => {
        this.edit(u);
      },
    },
    {
      label: 'Eliminar',
      color: 'danger',
      handler: u => {
        this.delete(u);
      },
    },
  ];

  public create(): void {
    this.router.navigateByUrl('/client/create');
  }

  public onSearch(query: string): void {
    this.rawQuery.set(query);
  }

  public edit(client: Client): void {
    this.router.navigateByUrl(`/client/edit/${client.id}`);
  }

  public delete(client: Client): void {
    if (!confirm(`¿Está seguro de eliminar el cliente ${client.name}?`)) return;

    this.clientStore
      .delete(client.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert(`Cliente ${client.name} eliminado`);
      });
  }
}
