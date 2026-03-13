import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ctc-account-management',
  imports: [RouterOutlet],
  templateUrl: './account-management.html',
  styleUrl: './account-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountManagement {}
