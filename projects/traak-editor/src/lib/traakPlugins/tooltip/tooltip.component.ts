import { Component, forwardRef } from '@angular/core';
import { traakSchema } from '../../builtins/schemas';
import { toggleMark } from 'prosemirror-commands';
import { NgClass, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { hasMark } from '../../utils';
import { TraakPlugin } from '../TraakPlugin';
import { appear } from '../../animations/appear';
import { InputContainerComponent } from './input-container/input-container.component';

@Component({
  selector: 'tooltip',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgOptimizedImage,
    NgClass,
    NgStyle,
    InputContainerComponent,
  ],
  providers: [
    { provide: TraakPlugin, useExisting: forwardRef(() => ToolTipComponent) },
  ],
  templateUrl: './tooltip.component.html',
  animations: [appear],
  styleUrl: './tooltip.component.css',
})
export class ToolTipComponent extends TraakPlugin {
  updatePlugin(): void {
    this.positionToolTip();
    this.updateMarks();
    this.isPluginVisible = this.currentTransaction
      ? !this.currentTransaction.selection.empty
      : false;
  }

  showInput: boolean = false;

  positionToolTip(): void {
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
          this.coordinates = coords;
        }
      }
    }
  }

  hasBold: boolean = false;
  hasLink: boolean = false;
  hasStrikethrough: boolean = false;
  hasItalic: boolean = false;
  hasCode: boolean = false;

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

    this.hasCode =
      this.currentTransaction != null &&
      hasMark(
        this.currentTransaction.doc,
        traakSchema.marks.code,
        this.currentTransaction.selection.from,
        this.currentTransaction.selection.to,
      );

    this.hasStrikethrough =
      this.currentTransaction != null &&
      hasMark(
        this.currentTransaction.doc,
        traakSchema.marks.strikethrough,
        this.currentTransaction.selection.from,
        this.currentTransaction.selection.to,
      );

    this.hasItalic =
      this.currentTransaction != null &&
      hasMark(
        this.currentTransaction.doc,
        traakSchema.marks.italic,
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
    this.showInput = true;
    this.isPluginVisible = false;
  }

  handleInputEvent() {
    this.showInput = false;
  }
}
