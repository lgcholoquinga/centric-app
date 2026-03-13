import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormCreateClient } from '@features/client/components';

@Component({
  selector: 'ctc-create-client',
  imports: [FormCreateClient],
  templateUrl: './create-client.html',
  styleUrl: './create-client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateClient {}
