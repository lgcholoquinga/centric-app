import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormMovement } from '@features/movement/components';

@Component({
  selector: 'ctc-create-movement',
  imports: [FormMovement],
  template: '<ctc-form-movement />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateMovement {}
