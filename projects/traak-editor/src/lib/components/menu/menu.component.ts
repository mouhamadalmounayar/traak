import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { addLine } from '../../builtins/commands';
import { Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
@Component({
  selector: 'block-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() view?: EditorView;
  @Input() node?: Node;
  @Input() start?: number;
  @Output() hideMenuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  setCursorToEndOfLine() {
    if (this.view && this.node && this.start) {
      let tr = this.view.state.tr;
      tr = tr.setSelection(
        TextSelection.create(
          tr.doc,
          this.start + this.node.nodeSize - 2,
          this.start + this.node.nodeSize - 2,
        ),
      );
      this.view.dispatch(tr);
    }
  }

  hideMenu() {
    this.hideMenuEvent.emit(false);
  }

  addLine($event: MouseEvent) {
    $event.preventDefault();
    if (this.view && this.node && this.start) {
      this.setCursorToEndOfLine();
      addLine(this.view.state, this.view.dispatch);
      this.view.focus();
    }
    this.hideMenu();
  }
}
