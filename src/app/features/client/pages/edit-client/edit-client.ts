import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormCreateClient } from '@features/client/components';
import type { Client } from '@features/client/interfaces';
import { ClientStore } from '@features/client/store';

@Component({
  selector: 'ctc-edit-client',
  imports: [FormCreateClient],
  templateUrl: './edit-client.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditClient implements OnInit {
  private readonly clientStore = inject(ClientStore);
  private readonly router = inject(Router);

  public id = input.required<string>();
  public editClient = signal<Client | undefined>(undefined);

  ngOnInit(): void {
    const client = this.clientStore.getClientById(this.id());
    if (!client) {
      alert('Client not found');
      this.router.navigate(['/client']);
      return;
    }

    this.editClient.set(client);
  }
}
