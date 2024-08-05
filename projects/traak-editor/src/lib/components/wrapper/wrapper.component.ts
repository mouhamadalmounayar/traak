/* eslint-disable */
import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { createMenu } from '../../builtins/menu';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { traakSchema } from '../../builtins/schemas';
import { hasMark } from '../../utils';

@Component({
  selector: 'lib-wrapper',
  standalone: true,
  imports: [TraakEditorComponent],
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
})
export class WrapperComponent {
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;

  menu?: HTMLDivElement;
  view?: EditorView;
  currentTransaction?: Transaction;

  constructor(private renderer: Renderer2) {}

  getView(view: EditorView) {
    this.view = view;
    this.initializeMenu();
    this.initializeMarks();
  }

  getTransaction(tr: Transaction) {
    this.currentTransaction = tr;
    this.updateMenuState();
    this.initializeMarks();
  }

  initializeMenu(): void {
    if (this.view) {
      this.menu = createMenu(this.view);
      this.renderer.appendChild(this.menuContainer.nativeElement, this.menu);
      this.renderer.addClass(this.menuContainer.nativeElement, 'empty');
    }
  }

  initializeMarks(): void {
    const boldItem = this.menu?.querySelector('#bold');
    const italicItem = this.menu?.querySelector('#italic');
    const strikethroughItem = this.menu?.querySelector('#strikethrough');
    const codeItem = this.menu?.querySelector('#code');

    const transaction = this.currentTransaction;
    const selection = this.currentTransaction?.selection;
    console.log('function called');
    console.log(boldItem);

    if (
      transaction &&
      selection &&
      boldItem &&
      italicItem &&
      strikethroughItem &&
      codeItem
    ) {
      hasMark(
        transaction.doc,
        traakSchema.marks.bold,
        selection.from,
        selection.to,
      )
        ? boldItem.classList.add('clicked')
        : boldItem.classList.remove('clicked');
      hasMark(
        transaction.doc,
        traakSchema.marks.italic,
        selection.from,
        selection.to,
      )
        ? italicItem.classList.add('clicked')
        : italicItem.classList.remove('clicked');
      hasMark(
        transaction.doc,
        traakSchema.marks.strikethrough,
        selection.from,
        selection.to,
      )
        ? strikethroughItem.classList.add('clicked')
        : strikethroughItem.classList.remove('clicked');
      hasMark(
        transaction.doc,
        traakSchema.marks.code,
        selection.from,
        selection.to,
      )
        ? codeItem.classList.add('clicked')
        : codeItem.classList.remove('clicked');
    }
  }

  updateMenuState(): void {
    if (this.menu && this.currentTransaction) {
      const selection = this.currentTransaction.selection;
      if (!selection.empty) {
        const coords = this.view?.coordsAtPos(selection.from);
        if (coords) {
          this.menuContainer.nativeElement.style.right = coords.right + 'px';
          this.menuContainer.nativeElement.style.left = coords.right + 'px';
          this.menuContainer.nativeElement.style.top = coords.top - 40 + 'px';
        }
        this.renderer.removeClass(this.menuContainer.nativeElement, 'empty');
      } else {
        this.renderer.addClass(this.menuContainer.nativeElement, 'empty');
      }
    }
  }
}
