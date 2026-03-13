import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountStore } from '@features/account/store';
import { ClientStore } from '@features/client/store';

@Component({
  selector: 'ctc-account-management',
  imports: [RouterOutlet],
  templateUrl: './account-management.html',
  styleUrl: './account-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountStore, ClientStore],
})
export default class AccountManagement {}
