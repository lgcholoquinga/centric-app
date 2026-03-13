import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovementStore } from '@features/movement/store';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';

@Component({
  selector: 'ctc-movement-management',
  imports: [RouterOutlet],
  templateUrl: './movement-management.html',
  styleUrl: './movement-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MovementStore, AccountStore, ClientStore],
})
export default class MovementManagement {
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
