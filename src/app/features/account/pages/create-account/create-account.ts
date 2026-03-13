import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormAccount } from '@features/account/components';

@Component({
  selector: 'ctc-create-account',
  imports: [FormAccount],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateAccount {}
