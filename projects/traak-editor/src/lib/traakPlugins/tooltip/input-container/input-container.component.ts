import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { toggleMark } from 'prosemirror-commands';
import { traakSchema } from '../../../builtins/schemas';
import { FormsModule } from '@angular/forms';
import { appear } from '../../../animations/appear';

@Component({
  selector: 'lib-input-container',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-container.component.html',
  styleUrl: './input-container.component.css',
  animations: [appear],
})
export class InputContainerComponent {
  @Input() view?: EditorView;
  @Output() showInputChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  inputValue: string = '';

  handleEnter($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.showInputChange.emit(false);
      if (this.view) {
        const command = toggleMark(traakSchema.marks.link, {
          href: this.inputValue,
        });
        command(this.view.state, this.view.dispatch);
      }
    }
  }

  handleClose() {
    this.showInputChange.emit(false);
  }
}
