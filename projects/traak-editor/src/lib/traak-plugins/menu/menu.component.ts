import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NgIf, NgStyle, NgClass } from '@angular/common';
import {
  addOrderedList,
  addBulletList,
  addLine,
  addTaskList,
} from '../../builtins/commands';
import { Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { TraakPlugin } from '../TraakPlugin';
import { AddButtonComponent } from './add-button/add-button.component';
import { appear } from '../../animations/appear';
import {
  HoverEventDetails,
  OutEventDetails,
} from '../../../types/traak-configuration';
import { HoverService } from '../../services/hover.service';
import { OutService } from '../../services/out.service';
import { Menu } from '../../../types/plugin-config/menu';
import { TraakNode } from '../../../types/traak-node';
import { findNodeByName } from '../../utils';

@Component({
  selector: 'block-menu',
  standalone: true,
  imports: [AddButtonComponent, NgIf, NgStyle, NgClass],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  animations: [appear],
  providers: [
    { provide: TraakPlugin, useExisting: forwardRef(() => MenuComponent) },
  ],
})
export class MenuComponent extends TraakPlugin implements OnInit {
  node?: Node;
  start?: number;
  nodes: TraakNode[];
  @Input() config: Menu;

  updatePlugin(): void {}

  isHoveringNode: boolean = false;
  isHoveringButton: boolean = false;

  constructor(
    private _hoverEventService: HoverService,
    private _outEventService: OutService,
  ) {
    super();
  }

  get buttonClasses() {
    return {
      'add-button__visible': this.isHoveringNode || this.isHoveringButton,
      'add-button__hidden': !this.isHoveringNode && !this.isHoveringButton,
    };
  }

  get classes() {
    const classes = [];
    if (this.class) {
      classes.push(this.class);
    }
    if (this.injectCss) {
      classes.push('menu-container');
    }
    return classes;
  }

  ngOnInit(): void {
    this._hoverEventService.event$.subscribe((details: HoverEventDetails) => {
      if (details) {
        this.coordinates = details.dims;
        this.node = details.node;
        this.start = details.start;
      }
      this.isHoveringNode = true;
    });
    this._outEventService.event$.subscribe((details: OutEventDetails) => {
      if (details && details.event === 'out') this.isHoveringNode = false;
    });
    this.initializeConfig(this.config);
  }

  override initializeConfig(config: Menu): void {
    super.initializeConfig(config);
    this.nodes = config.nodes;
  }

  setCursorToEndOfLine() {
    if (this.view && this.node && this.start) {
      let tr = this.view.state.tr;
      tr = tr.setSelection(
        TextSelection.create(
          tr.doc,
          this.start + this.node.nodeSize - 2,
          this.start + this.node.nodeSize - 2,
        ),
      );
      this.view.dispatch(tr);
    }
  }

  hideMenu() {
    this.isPluginVisible = false;
  }

  showMenu() {
    this.isPluginVisible = true;
  }

  onMouseOut(): void {
    this.isHoveringButton = false;
  }

  onMouseOver(): void {
    this.isHoveringButton = true;
  }

  addBulletList($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      this.setCursorToEndOfLine();
      addBulletList(this.view.state, this.view.dispatch);
    }
  }

  addOrderedList($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      this.setCursorToEndOfLine();
      addOrderedList(this.view.state, this.view.dispatch);
    }
  }

  addLine($event: MouseEvent) {
    $event.preventDefault();
    if (this.view && this.node && this.start) {
      this.setCursorToEndOfLine();
      addLine(this.view.state, this.view.dispatch);
      this.view.focus();
    }
    this.hideMenu();
  }

  addTaskList($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      this.setCursorToEndOfLine();
      addTaskList(this.view.state, this.view.dispatch);
    }
  }

  protected readonly findNodeByName = findNodeByName;
}
