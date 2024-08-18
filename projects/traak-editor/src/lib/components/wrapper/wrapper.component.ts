import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { ToolTipComponent } from '../tooltip/tooltip.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { InputContainerComponent } from '../input-container/input-container.component';
import { buttonAppear } from '../../animations/button.animation';
import { MenuComponent } from '../menu/menu.component';
import { Node } from 'prosemirror-model';
type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

@Component({
  selector: 'lib-wrapper',
  imports: [
    TraakEditorComponent,
    ToolTipComponent,
    NgIf,
    NgStyle,
    InputContainerComponent,
    NgClass,
    MenuComponent,
  ],
  standalone: true,
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
  animations: [buttonAppear],
  encapsulation: ViewEncapsulation.None,
})
export class WrapperComponent {
  right?: number;
  left?: number;
  top?: number;
  view?: EditorView;
  currentTransaction?: Transaction;
  node?: Node;
  start?: number;
  showInput: boolean = false;
  showToolTip: boolean = false;
  hoveringToolTip: boolean = false;
  blockMenuCoordinates?: Coordinates;
  showMenu: boolean = false;

  get addButtonClasses() {
    return {
      'add-button__visible': this.showToolTip || this.hoveringToolTip,
      'add-button__hidden': !this.showToolTip && !this.hoveringToolTip,
    };
  }

  get menuClasses() {
    return {
      menu__visible: this.showMenu,
      menu__hidden: !this.showMenu,
    };
  }

  constructor(private cdr: ChangeDetectorRef) {}

  getView(view: EditorView) {
    this.view = view;
    this.cdr.detectChanges();
  }

  getTransaction(tr: Transaction) {
    this.currentTransaction = tr;
    this.updateMenuState();
  }

  updateMenuState(): void {
    if (this.currentTransaction) {
      const docSize = this.currentTransaction.doc.content.size;
      const selection = this.currentTransaction.selection;
      if (
        selection.from >= 0 &&
        selection.from <= docSize &&
        selection.to >= 0 &&
        selection.to <= docSize
      ) {
        const coords = this.view?.coordsAtPos(selection.from);
        if (coords) {
          this.right = coords.right;
          this.left = coords.right;
          this.top = coords.top - 30;
        }
      }
    }
  }

  handleInput($event: boolean) {
    this.showInput = $event;
  }

  handleNodeHover($event: CustomEvent) {
    this.showToolTip = true;
    this.blockMenuCoordinates = $event.detail.dims;
    this.node = $event.detail.node;
    this.start = $event.detail.start;
  }

  handleMenuHover($event: MouseEvent) {
    $event.preventDefault();
    this.hoveringToolTip = true;
  }

  handleMenuOut($event: MouseEvent) {
    $event.preventDefault();
    this.hoveringToolTip = false;
  }

  handleNodeOut($event: CustomEvent) {
    $event.preventDefault();
    this.showToolTip = false;
  }

  handleMenuButtonClick($event: MouseEvent) {
    $event.preventDefault();
    this.showMenu = true;
  }

  hideMenu($event: boolean) {
    this.showMenu = $event;
  }
}
