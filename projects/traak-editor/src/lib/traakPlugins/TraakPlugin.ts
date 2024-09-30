import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Coordinates } from '../../types/traakConfiguration';
import { TraakManager } from '../utilities';

/**
 * An abstract that defines the methods and attributes to have a functional plugin.
 */
export abstract class TraakPlugin {
  view?: EditorView;
  currentTransaction?: Transaction;
  coordinates?: Coordinates;
  isPluginVisible: boolean;
  manager: TraakManager;
  abstract updatePlugin(): void;
  constructor() {
    this.view = null;
    this.currentTransaction = null;
    this.coordinates = null;
    this.isPluginVisible = false;
    this.manager = new TraakManager(this.view);
  }
}
