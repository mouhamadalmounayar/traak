import { Component, Input } from '@angular/core';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Coordinates } from '../../types/configuration.model';
@Component({
  template: '',
  standalone: true,
})
export class TraakPlugin {
  @Input() currentTransaction!: Transaction;
  @Input() view!: EditorView;
  isPluginVisible: boolean = false;
  coordinates!: Coordinates;

  showPlugin($event: Event) {
    $event.preventDefault();
    this.isPluginVisible = true;
  }

  hidePlugin($event: Event) {
    $event.preventDefault();
    this.isPluginVisible = false;
  }
}
