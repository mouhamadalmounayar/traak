import { Component, ViewEncapsulation } from '@angular/core';
import {
  DocTitle,
  BulletList,
  Line,
  ListItem,
  Menu,
  WrapperComponent,
  OrderedList,
  TaskCheckbox,
  TaskList,
} from 'traak-editor';
import { ToolTipComponent } from 'traak-editor';
import { TraakConfiguration } from 'traak-editor';
import { MenuComponent } from 'traak-editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [WrapperComponent, ToolTipComponent, MenuComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent {
  config: TraakConfiguration = {
    useStarters: false,
    nodes: [
      DocTitle,
      ListItem,
      BulletList,
      OrderedList,
      TaskCheckbox,
      TaskList,
    ],
  };
  pluginConfig: Menu = {
    nodes: [BulletList, Line, OrderedList, TaskList],
    styles: {
      'inject-css': true,
      class: 'menu-container',
    },
  };
}
