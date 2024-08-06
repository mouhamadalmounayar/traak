import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { traakSchema } from '../../builtins/schemas';
import { toggleMark } from 'prosemirror-commands';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from 'prosemirror-state';
import { hasMark } from '../../utils';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [NgIf, FormsModule, NgOptimizedImage, NgClass],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnChanges {
  showMenu: boolean = true;
  @Input() currentTransaction?: Transaction;
  @Input() view?: EditorView;
  @Output() showInputChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  hasBold: boolean = false;
  hasLink: boolean = false;

  ngOnChanges() {
    this.updateMarks();
  }

  updateMarks() {
    this.hasBold =
      this.currentTransaction != null &&
      hasMark(
        this.currentTransaction.doc,
        traakSchema.marks.bold,
        this.currentTransaction.selection.from,
        this.currentTransaction.selection.to,
      );

    this.hasLink =
      this.currentTransaction != null &&
      hasMark(
        this.currentTransaction.doc,
        traakSchema.marks.link,
        this.currentTransaction.selection.from,
        this.currentTransaction.selection.to,
      );
  }

  toggleBold($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      const command = toggleMark(traakSchema.marks.bold);
      command(this.view.state, this.view.dispatch);
    }
  }

  toggleItalic() {
    if (this.view) {
      const command = toggleMark(traakSchema.marks.italic);
      command(this.view.state, this.view.dispatch);
    }
  }

  toggleStrikeThrough($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      const command = toggleMark(traakSchema.marks.strikethrough);
      command(this.view.state, this.view.dispatch);
    }
  }

  toggleCode($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      const command = toggleMark(traakSchema.marks.code);
      command(this.view.state, this.view.dispatch);
    }
  }

  toggleLink($event: MouseEvent) {
    if (this.hasLink && this.view) {
      const command = toggleMark(traakSchema.marks.link);
      command(this.view.state, this.view.dispatch);
      return;
    }
    $event.preventDefault();
    this.showMenu = false;
    this.showInputChange.emit(true);
  }
}
