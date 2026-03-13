import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { MovementStore } from '@features/movement/store';

@Component({
  selector: 'ctc-report-management',
  imports: [RouterOutlet],
  template: `
    <div class="report-management">
      <h1 class="title">Reports</h1>
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MovementStore, AccountStore, ClientStore],
})
export default class ReportManagement {
  private readonly movementStore = inject(MovementStore);
  private readonly accountStore = inject(AccountStore);
  private readonly clientStore = inject(ClientStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.movementStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.accountStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.clientStore.loadAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
