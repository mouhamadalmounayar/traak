/* eslint-disable */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { MenuComponent } from '../menu/menu.component';
import { NgIf, NgStyle } from '@angular/common';
import { InputContainerComponent } from '../input-container/input-container.component';

@Component({
  selector: 'lib-wrapper',
  standalone: true,
  imports: [
    TraakEditorComponent,
    MenuComponent,
    NgIf,
    NgStyle,
    InputContainerComponent,
  ],
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
})
export class WrapperComponent {
  @ViewChild('#menu', { static: true }) menuContainer!: ElementRef;
  right?: number;
  left?: number;
  top?: number;
  view?: EditorView;
  currentTransaction?: Transaction;
  showInput: boolean = false;

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
        const coords = this.view?.coordsAtPos(selection.from - 1);
        if (coords) {
          this.right = coords.right;
          this.left = coords.right;
          this.top = coords.top - 40;
        }
      }
    }
  }

  handleInput($event: boolean) {
    this.showInput = $event;
  }
}
