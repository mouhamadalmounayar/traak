import { Directive } from '@angular/core';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Coordinates } from '../../types/traakConfiguration';
@Directive()
export abstract class TraakPlugin {
  abstract view?: EditorView;
  abstract currentTransaction?: Transaction;
  abstract coordinates?: Coordinates;
  abstract isPluginVisible: boolean;
  abstract updatePlugin(): void;
}
