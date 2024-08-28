import {
  ChangeDetectorRef,
  Component,
  Input,
  Signal,
  ViewEncapsulation,
  contentChildren,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { Node } from 'prosemirror-model';
import { TraakConfiguration } from '../../../types/traakConfiguration';
import { TraakPlugin } from '../../traakPlugins/TraakPlugin';
import { ToolTipComponent } from '../../traakPlugins/tooltip/tooltip.component';
@Component({
  selector: 'lib-wrapper',
  imports: [
    TraakEditorComponent,
    ToolTipComponent,
    NgIf,
    NgStyle,
    NgClass,
    MenuComponent,
  ],
  standalone: true,
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WrapperComponent {
  view?: EditorView;
  currentTransaction?: Transaction;
  node?: Node;
  start?: number;
  @Input() config!: TraakConfiguration;
  signals: Signal<readonly TraakPlugin[]> = contentChildren(TraakPlugin);
  constructor(private cdr: ChangeDetectorRef) {}

  getView(view: EditorView) {
    const plugins = this.signals();
    plugins.forEach((plugin: TraakPlugin) => {
      plugin.view = view;
      plugin.updatePlugin();
    });
    this.cdr.detectChanges();
  }

  getTransaction(tr: Transaction) {
    this.currentTransaction = tr;
    const plugins = this.signals();
    plugins.forEach((plugin: TraakPlugin) => {
      plugin.currentTransaction = tr;
      plugin.updatePlugin();
    });
    this.cdr.detectChanges();
  }
}
