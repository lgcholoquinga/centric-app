import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ctc-client-management',
  imports: [RouterOutlet],
  templateUrl: './client-management.html',
  styleUrl: './client-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientManagement {}
