import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Coordinates } from '../../types/traak-configuration';
import { TraakManager } from '../utilities';
import { PluginConfig } from '../../types/plugin-config/plugin-config';

/**
 * An abstract that defines the methods and attributes for having a functional plugin.
 */
export abstract class TraakPlugin {
  injectCss: boolean = true;
  class: string;
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

  initializeConfig(config: PluginConfig) {
    if (config.styles['inject-css'] !== undefined)
      this.injectCss = config.styles['inject-css'];
    if (config.styles.class) this.class = config.styles.class;
  }
}
