import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { Account } from '@features/account/interfaces';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { Button } from '@shared/components';

@Component({
  selector: 'ctc-form-account',
  imports: [Button, RouterLink, ReactiveFormsModule],
  templateUrl: './form-account.html',
  styleUrl: './form-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAccount {
  private readonly fb = inject(FormBuilder);
  private readonly accountStore = inject(AccountStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly clientStore = inject(ClientStore);

  public action = input<'add' | 'edit'>('add');
  public title = input('Nueva cuenta');
  public account = input<Account>();

  public form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required]],
    type: ['savings' as 'savings' | 'checking', [Validators.required]],
    openingBalance: [0, [Validators.required, Validators.min(0)]],
    status: [true],
    clientId: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const account = this.account();
      if (this.action() === 'edit' && account) {
        const { accountNumber, type, openingBalance, status, clientId } = account;
        this.form.setValue({ accountNumber, type, openingBalance, status, clientId });
        this.form.markAllAsTouched();
      }
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.action() === 'add') {
      this.addAccount();
      return;
    }

    this.editAccount();
  }

  private addAccount(): void {
    const { accountNumber, type, openingBalance, status, clientId } = this.form.getRawValue();
    this.accountStore
      .add({ accountNumber, type, openingBalance, status, clientId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Cuenta creada correctamente');
        this.router.navigate(['/account']);
      });
  }

  private editAccount(): void {
    const account = this.account();
    if (!account) return;

    const { accountNumber, type, openingBalance, status, clientId } = this.form.getRawValue();
    this.accountStore
      .update({ id: account.id, accountNumber, type, openingBalance, status, clientId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Cuenta actualizada correctamente');
        this.router.navigate(['/account']);
      });
  }
}
