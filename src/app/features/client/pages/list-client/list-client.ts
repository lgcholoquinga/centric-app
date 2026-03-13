import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ctc-list-client',
  imports: [],
  templateUrl: './list-client.html',
  styleUrl: './list-client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListClient {}
