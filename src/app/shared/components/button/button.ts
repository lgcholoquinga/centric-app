import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'ctc-button',
  imports: [],
  template: `
    <button [class]="hostClass()" [type]="type()" (click)="handleClick($event)">
      {{ label() }}
    </button>
  `,
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  public label = input('');
  public type = input<'button' | 'submit' | 'reset'>('button');
  public color = input<'primary' | 'secondary' | 'danger'>('primary');
  public size = input<'sm' | 'md' | 'lg'>('md');
  public disabled = input(false);

  public ctcClick = output<Event>();

  public hostClass = computed(() => `ctc-button--${this.color()} ctc-button--${this.size()}`);

  public handleClick(event: Event) {
    if (this.disabled()) return;

    this.ctcClick.emit(event);
  }
}
