import { Component, OnInit, forwardRef } from '@angular/core';
import { NgIf, NgStyle, NgClass } from '@angular/common';
import { EditorView } from 'prosemirror-view';
import { addList, addLine } from '../../builtins/commands';
import { Node } from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
import { TraakPlugin } from '../TraakPlugin';
import { Coordinates } from '../../../types/traakConfiguration';
import { AddButtonComponent } from './add-button/add-button.component';
import { NodeService } from '../../services/node.service';
import { appear } from '../../animations/appear';
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
  currentTransaction?: Transaction | undefined;
  view?: EditorView;
  node?: Node;
  start?: number;
  isPluginVisible: boolean = false;
  coordinates?: Coordinates;
  updatePlugin(): void {}
  isHoveringNode: boolean = false;
  isHoveringButton: boolean = false;

  constructor(private _nodeService: NodeService) {
    super();
  }

  get classes() {
    return {
      'add-button__visible': this.isHoveringNode || this.isHoveringButton,
      'add-button__hidden': !this.isHoveringNode && !this.isHoveringButton,
    };
  }

  ngOnInit(): void {
    this._nodeService.hover$.subscribe((details) => {
      if (details) {
        this.coordinates = details.dims;
        this.node = details.node;
        this.start = details.start;
      }
      this.isHoveringNode = true;
    });

    this._nodeService.out$.subscribe(() => {
      this.isHoveringNode = false;
    });
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
      addList('bullet_list', this.view.state, this.view.dispatch);
    }
  }

  addOrderedList($event: MouseEvent) {
    $event.preventDefault();
    if (this.view) {
      this.setCursorToEndOfLine();
      addList('ordered_list', this.view.state, this.view.dispatch);
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
}
