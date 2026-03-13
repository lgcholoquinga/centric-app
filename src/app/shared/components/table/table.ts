import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { TableAction, TableColumn } from '@shared/interfaces';
import { Button } from '../button/button';

@Component({
  selector: 'ctc-table',
  imports: [Button],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T = unknown> {
  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  actions = input<TableAction<T>[]>([]);
  emptyMessage = input('No hay datos disponibles');

  rowClick = output<T>();

  protected hasActions = computed(() => this.actions().length > 0);
  protected colspan = computed(() => this.columns().length + (this.hasActions() ? 1 : 0));

  protected onRowKeydown(event: KeyboardEvent, row: T): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.rowClick.emit(row);
    }
  }

  protected onActionClick(event: Event, action: TableAction<T>, row: T): void {
    event.stopPropagation();
    action.handler(row);
  }
}
