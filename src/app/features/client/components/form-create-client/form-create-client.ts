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
import type { Client } from '@features/client/interfaces';
import { ClientStore } from '@features/client/store';
import { Button } from '@shared/components';

@Component({
  selector: 'ctc-form-create-client',
  imports: [Button, RouterLink, ReactiveFormsModule],
  templateUrl: './form-create-client.html',
  styleUrl: './form-create-client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreateClient {
  private readonly fb = inject(FormBuilder);
  private readonly clientStore = inject(ClientStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public action = input<'add' | 'edit'>('add');
  public title = input('Add new client');
  public client = input<Client>();

  public form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    adress: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    status: [true],
  });

  constructor() {
    effect(() => {
      const client = this.client();
      if (this.action() === 'edit' && client) {
        const { name, adress, phone, password, status } = client;
        this.form.setValue({ name, adress, phone, password, status });
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
      this.addClient();
      return;
    }

    this.editClient();
  }

  private addClient(): void {
    const { name, adress, phone, password, status } = this.form.getRawValue();
    this.clientStore
      .add({ name, adress, phone, password, status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Client added successfully!');
        this.router.navigate(['/client']);
      });
  }

  private editClient(): void {
    const client = this.client();
    if (!client) return;

    const { name, adress, phone, password, status } = this.form.getRawValue();
    this.clientStore
      .update({ id: client.id, name, adress, phone, password, status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        alert('Client updated successfully!');
        this.router.navigate(['/client']);
      });
  }
}
