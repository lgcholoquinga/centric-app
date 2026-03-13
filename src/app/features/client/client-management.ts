import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientStore } from '@features/client/store';

@Component({
  selector: 'ctc-client-management',
  imports: [RouterOutlet],
  templateUrl: './client-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientStore],
})
export default class ClientManagement {}
