import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';
import { MovementStore } from '@features/movement/store';
import { Button } from '@shared/components';

@Component({
  selector: 'ctc-form-movement',
  imports: [Button, RouterLink, ReactiveFormsModule],
  templateUrl: './form-movement.html',
  styleUrl: './form-movement.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormMovement {
  private readonly fb = inject(FormBuilder);
  private readonly movementStore = inject(MovementStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly accountStore = inject(AccountStore);
  public readonly clientStore = inject(ClientStore);

  public form = this.fb.nonNullable.group({
    date: [new Date().toISOString().split('T')[0], [Validators.required]],
    accountId: ['', [Validators.required]],
    type: ['deposit' as 'deposit' | 'withdrawal', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
  });

  private formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  protected selectedAccount = computed(() => {
    const accountId = this.formValues().accountId;
    return this.accountStore.accounts().find(a => a.id === accountId);
  });

  protected currentBalance = computed(() => {
    const account = this.selectedAccount();
    if (!account) return 0;
    return this.movementStore.getLastBalanceByAccount(account.id, account.openingBalance);
  });

  protected newBalance = computed(() => {
    const { type, amount } = this.formValues();
    const base = this.currentBalance();
    if (!amount || amount <= 0) return base;
    return type === 'deposit' ? base + amount : base - amount;
  });

  protected accountOptions = computed(() =>
    this.accountStore.accounts().map(a => ({
      id: a.id,
      label: `${a.accountNumber} — ${this.clientStore.clients().find(c => c.id === a.clientId)?.name ?? 'N/A'}`,
    }))
  );

  protected clientName = computed(() => {
    const account = this.selectedAccount();
    if (!account) return '';
    return this.clientStore.clients().find(c => c.id === account.clientId)?.name ?? '';
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { date, accountId, type, amount } = this.form.getRawValue();
    const balance = this.newBalance();

    if (type === 'withdrawal' && this.currentBalance() === 0) {
      alert('Saldo no disponible');
      return;
    }

    if (type === 'withdrawal' && balance < 0) {
      alert('Saldo insuficiente para realizar el retiro');
      return;
    }

    const signedAmount = type === 'withdrawal' ? -amount : amount;

    this.movementStore
      .add({ date, accountId, type, amount: signedAmount, balance })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Movimiento registrado correctamente');
        this.router.navigate(['/movement']);
      });
  }
}
