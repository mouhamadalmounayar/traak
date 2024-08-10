import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { MenuComponent } from '../menu/menu.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { InputContainerComponent } from '../input-container/input-container.component';
import { buttonAppear } from '../../animations/button.animation';

type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

@Component({
  selector: 'lib-wrapper',
  standalone: true,
  imports: [
    TraakEditorComponent,
    MenuComponent,
    NgIf,
    NgStyle,
    InputContainerComponent,
    NgClass,
  ],
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
  animations: [buttonAppear],
})
export class WrapperComponent {
  @ViewChild('#menu', { static: true }) menuContainer!: ElementRef;
  right?: number;
  left?: number;
  top?: number;
  view?: EditorView;
  currentTransaction?: Transaction;
  showInput: boolean = false;
  showBlockMenu: boolean = false;
  hoveringMenu: boolean = false;
  blockMenuCoordinates?: Coordinates;

  get classes() {
    return {
      visible: this.showBlockMenu || this.hoveringMenu,
      hidden: !this.showBlockMenu && !this.hoveringMenu,
    };
  }

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {}

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
    this.showBlockMenu = true;
    this.blockMenuCoordinates = $event.detail.dims;
  }

  handleMenuHover($event: MouseEvent) {
    $event.preventDefault();
    this.hoveringMenu = true;
  }

  handleMenuOut($event: MouseEvent) {
    $event.preventDefault();
    this.hoveringMenu = false;
  }

  handleNodeOut($event: CustomEvent) {
    $event.preventDefault();
    this.showBlockMenu = false;
  }
}
