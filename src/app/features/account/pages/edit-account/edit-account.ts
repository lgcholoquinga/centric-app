import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormAccount } from '@features/account/components';
import type { Account } from '@features/account/interfaces';
import { AccountStore } from '@features/account/store';

@Component({
  selector: 'ctc-edit-account',
  imports: [FormAccount],
  templateUrl: './edit-account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditAccount implements OnInit {
  private readonly accountStore = inject(AccountStore);
  private readonly router = inject(Router);

  public id = input.required<string>();
  public editAccount = signal<Account | undefined>(undefined);

  ngOnInit(): void {
    const account = this.accountStore.getAccountById(this.id());
    if (!account) {
      alert('Cuenta no encontrada');
      this.router.navigate(['/account']);
      return;
    }

    this.editAccount.set(account);
  }
}
