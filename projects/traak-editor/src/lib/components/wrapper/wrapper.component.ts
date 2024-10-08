import {
  ChangeDetectorRef,
  Component,
  Input,
  Signal,
  ViewEncapsulation,
  contentChildren,
  OnInit,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { TraakEditorComponent } from '../traak-editor/traak-editor.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { MenuComponent } from '../../traak-plugins/menu/menu.component';
import { Node } from 'prosemirror-model';
import { TraakConfiguration } from '../../../types/traak-configuration';
import { TraakPlugin } from '../../traak-plugins/TraakPlugin';
import { ToolTipComponent } from '../../traak-plugins/tooltip/tooltip.component';
import { validateGlobalConfig } from '../../validations/validate';
import { HoverService } from '../../services/hover.service';
import { ClickService } from '../../services/click.service';
import { OutService } from '../../services/out.service';

@Component({
  selector: 'wrapper',
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
export class WrapperComponent implements OnInit {
  view?: EditorView;
  currentTransaction?: Transaction;
  node?: Node;
  @Input() config!: TraakConfiguration;
  signals: Signal<readonly TraakPlugin[]> = contentChildren(TraakPlugin);

  constructor(
    private cdr: ChangeDetectorRef,
    private _hoverEventService: HoverService,
    private _clickEventService: ClickService,
    private _outEventService: OutService,
  ) {}

  ngOnInit() {
    validateGlobalConfig(this.config);
  }

  getView(view: EditorView) {
    this.view = view;
    const plugins = this.signals();
    plugins.forEach((plugin: TraakPlugin) => {
      plugin.view = view;
      plugin.manager.updateView(view);
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

  handleNodeHover($event: CustomEvent) {
    this._hoverEventService.sendDetails($event.detail);
  }

  handleNodeOut($event: CustomEvent) {
    this._outEventService.sendDetails($event.detail);
  }

  handleNodeClick($event: CustomEvent) {
    this._clickEventService.sendDetails($event.detail);
  }
}
