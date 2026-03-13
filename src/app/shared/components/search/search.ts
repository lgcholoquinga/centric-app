import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ctc-search',
  imports: [],
  template: `<input
    type="text"
    [placeholder]="placeholder()"
    (input)="onInput($event.target.value)"
  /> `,
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  public placeholder = input<string>('Buscar');

  public ctcValue = output<string>();

  public onInput(value: string): void {
    this.ctcValue.emit(value);
  }
}
